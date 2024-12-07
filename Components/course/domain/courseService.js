const CourseModel = require("../data-access/CourseModel");
const SkillModel = require("../data-access/SkillModel");
const TopicModel = require("../data-access/TopicModel");
const mongoose = require("mongoose");

const CourseService = {
    getCourses: async (
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

        const topics = await TopicModel.GetAllTopics();
        const skills = await SkillModel.GetAllSkills();

        return {
            courses: coursesQuery,
            currentPage: page,
            totalPages: coursesQuery.totalPages,
            isLastPage: page == coursesQuery.totalPages,
            topics,
            skills,
        };
    },

    getCourseDetail: async (courseId) => {
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
                    localField: "_id", // `_id` của Course
                    foreignField: "CourseId", // `CourseId` của Module
                    as: "Modules", // Gắn Modules vào kết quả
                },
            },

            {
                $unwind: {
                    path: "$Modules", // Tách các modules ra từng tài liệu
                    preserveNullAndEmptyArrays: true, // Giữ lại Course nếu không có Module
                },
            },

            {
                $lookup: {
                    from: "Lessons",
                    localField: "Modules._id", // `_id` của Module
                    foreignField: "ModuleId", // `ModuleId` của Lessons
                    as: "Modules.Lessons", // Gắn Lessons vào từng Module
                },
            },

            {
                $group: {
                    _id: "$_id", // Group lại theo `_id` của course
                    Title: { $first: "$Title" },
                    SkillGain: { $first: "$SkillGain" },
                    Topic: { $first: "$Topic" },
                    Modules: { $push: "$Modules" }, // Gom tất cả các module vào mảng Modules
                },
            },
        ]);

        const relevantCourses = await CourseModel.GetAllRelevantCourses(Course[0]._id);
        return {
            title: Course[0].Title,
            Course: Course[0],
            relevantCourses,
        };
    },
};

module.exports = CourseService;
