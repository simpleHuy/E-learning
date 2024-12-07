const CourseService = require("../domain/courseService");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

// Function to fetch and display courses with pagination
const CourseController = {
    getCourses: async (req, res) => {
        try {
            const { search, topic, skill, level, price, sort, order, page } =
                req.query;

            const CoursesData = await CourseService.getCourses(
                search,
                topic,
                skill,
                level,
                price,
                sort,
                order,
                page
            );

            // Render the Handlebars template with pagination and courses data
            res.render("pages/courseslist", {
                courses: CoursesData.courses,
                currentPage: CoursesData.currentPage,
                totalPages: CoursesData.totalPages,
                prevPage: CoursesData.prevPage,
                nextPage: CoursesData.nextPage,
                isFirstPage: CoursesData.isFirstPage,
                isLastPage: CoursesData.isLastPage,
                topics: CoursesData.topics,
                skills: CoursesData.skills,
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
