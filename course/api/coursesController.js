// coursesController.js
const ITEMS_PER_PAGE = 6;

const CourseModel = require("../data-access/CourseModel");
const SkillModel = require("../data-access/SkillModel");
const TopicModel = require("../data-access/TopicModel");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

// Function to fetch and display courses with pagination
const CourseController = {
    getCourses: async (req, res) => {
        try {
            const { search, topic, skill, level, price, sort, order } = req.query;

            const coursesQuery = await CourseModel.GetCoursesByFilter(
                search,
                topic,
                skill,
                level,
                price,
                sort, 
                order
            );

            // Get the current page number from the query parameters or set to 1 if not provided
            const page = parseInt(req.query.page) || 1;

            // Fetch the total number of courses to calculate total pages
            const startIndex = (page - 1) * ITEMS_PER_PAGE;
            const endIndex = page * ITEMS_PER_PAGE;
            // Calculate pagination details
            const totalCourses = coursesQuery.length;
            const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE);

            const courses = coursesQuery.slice(startIndex, endIndex);
            // Prepare pagination variables
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            const isFirstPage = page === 1;
            const isLastPage = page === totalPages;

            // get all topics and skills
            const topics = await TopicModel.GetAllTopics();
            const skills = await SkillModel.GetAllSkills();

            // Render the Handlebars template with pagination and courses data
            res.render("pages/courseslist", {
                courses,
                currentPage: page,
                totalPages,
                prevPage,
                nextPage,
                isFirstPage,
                isLastPage,
                topics: topics,
                skills: skills,
            });
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).send("An error occurred while fetching courses.");
        }
    },

    GetCourseDetail: async (req, res) => {
        try {
            const CourseId = req.params.id;
            const Course = await CourseModel.GetCourseById(CourseId);
            if (!Course) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
            }

            await Course.FetchAllModules();

            for (let i = 0; i < Course.Modules.length; i++) {
                const Module = Course.Modules[i];
                await Module.FetchAllLessons();
            }

            const RelevantCourses = await Course.GetAllRelevantCourses(Course);

            return res.status(StatusCodes.OK).render("pages/CourseDetail", {
                title: Course.Title,
                Course: Course,
                RelevantCourses: RelevantCourses,
            });
        } catch (error) {
            console.error("Error fetching course detail:", error); // Log error
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },
};

module.exports = CourseController;
