const CourseModel = require("../data-access/CourseModel");
const SkillModel = require("../data-access/SkillModel");
const TopicModel = require("../data-access/TopicModel");
const mongoose = require("mongoose");

const CourseService = {
    getCoursesListInfo: async (
        search,
        topic,
        skill,
        level,
        price,
        sort,
        order,
        page
    ) => {
        const coursesQuery = await CourseService.GetCourse(
            search,
            topic,
            skill,
            level,
            price,
            sort,
            order,
            page
        );

        const topics = await TopicModel.GetAllTopics();
        const skills = await SkillModel.GetAllSkills();

        return {
            courses: coursesQuery.courses,
            currentPage: page || 1,
            totalPages: coursesQuery.totalPages,
            isFirstPage: page == 1 || !page,
            isLastPage: page >= coursesQuery.totalPages,
            topics,
            skills,
        };
    },

    getCourseDetail: async (courseId) => {
        try {
            // Validate courseId
            if (!courseId) {
                throw new Error('Course ID is required');
            }
            // Check if courseId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                throw new Error('Invalid Course ID format');
            }
    
            const Course = await CourseModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
                {
                    $lookup: {
                        from: "Skills",
                        localField: "SkillGain",
                        foreignField: "_id",
                        as: "SkillGain",
                    },
                },
                {
                    $lookup: {
                        from: "Modules",
                        localField: "_id",
                        foreignField: "CourseId",
                        as: "Modules",
                    },
                },
                {
                    $unwind: {
                        path: "$Modules",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "Lessons",
                        localField: "Modules._id",
                        foreignField: "ModuleId",
                        as: "Modules.Lessons",
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        Title: { $first: "$Title" },
                        SkillGain: { $first: "$SkillGain" },
                        Topic: { $first: "$Topic" },
                        Modules: { $push: "$Modules" },
                        Duration: { $first: "$Duration" },
                        Level: { $first: "$Level" },
                        Description: { $first: "$Description" },
                        Img: { $first: "$Img" },
                        Price: { $first: "$Price" },
                        Rate: { $first: "$Rate" },
                        Lecturer: { $first: "$Lecturer" },
                    },
                },
            ]);
    
            // Check if course exists
            if (!Course || Course.length === 0) {
                throw new Error('Course not found');
            }
    
            const RelevantCourses = await CourseModel.GetAllRelevantCourses(
                Course[0]._id
            );
    
            return {
                title: Course[0].Title,
                Course: Course[0],
                RelevantCourses,
            };
        } catch (error) {
            console.error('Error in getCourseDetail:', error);
            throw error;
        }
    },

    AddToCart: async (courseId) => {
        const result = await CourseModel.GetCourseById(courseId);
        await result.FetchAllModules();

        return result;
    },

    GetCourse: async (
        search,
        topic,
        skill,
        level,
        price,
        sort,
        order,
        page
    ) => {
        const coursesQuery = await CourseModel.GetCoursesByFilter(
            search,
            topic,
            skill,
            level,
            price,
            sort,
            order,
            page
        );

        return {
            courses: coursesQuery.courses,
            currentPage: page || 1,
            totalPages: coursesQuery.totalPages,
        };
    },
};

module.exports = CourseService;
