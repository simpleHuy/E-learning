const CourseModel = require("../data-access/CourseModel");
const SkillModel = require("../data-access/SkillModel");
const TopicModel = require("../data-access/TopicModel");

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
};

module.exports = CourseService;
