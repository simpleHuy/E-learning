const CourseService = require("../domain/courseService");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const redisClient = require("../../../config/redis");

// Function to fetch and display courses with pagination
const CourseController = {
    getCoursesList: async (req, res) => {
        try {
            const { search, topic, skill, level, price, sort, order, page } =
                req.query;

            const CoursesData = await CourseService.getCoursesListInfo(
                search,
                topic,
                skill,
                level,
                price,
                sort,
                order,
                page
            );
            // change params to string
            const cacheKey = req.originalUrl;
            await redisClient.set(cacheKey, JSON.stringify(CoursesData), {
                EX: 60 * 60, // 1 hour
            });

            res.render("pages/courseslist", {
                title: "Our Courses",
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
            const isLoggedIn = false;
            const { title, Course, RelevantCourses } =
                await CourseService.getCourseDetail(CourseId);

            await redisClient.set(
                req.params.id,
                JSON.stringify({ title, Course, RelevantCourses }),
                { EX: 60 * 60 }
            );

            return res.status(StatusCodes.OK).render("pages/CourseDetail", {
                title: title,
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

    AddToCart: async (req, res) => {
        try {
            const { courseid } = req.body;
            const result = await CourseService.AddToCart(courseid);
            if (!result) {
                console.log("Course not found for id:", courseid);
                return res
                    .status(404)
                    .json({ success: false, message: "Course not found" });
            }
            res.status(200).json({
                success: true,
                message: "Added to cart",
                course: result,
            });
        } catch (error) {
            console.error("Error in add-to-cart API:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    GetCourseData: async (req, res) => {
        try {
            const { search, topic, skill, level, price, sort, order, page } =
                req.query;

            const CoursesData = await CourseService.GetCourse(
                search,
                topic,
                skill,
                level,
                price,
                sort,
                order,
                page
            );

            // set parameters for key
            const cacheKey = req.originalUrl;
            await redisClient.set(cacheKey, JSON.stringify(CoursesData), {
                EX: 60 * 60, // 1 hour
            });

            return res.status(200).json(CoursesData);
        } catch (error) {
            console.error("Error in GetCourseData:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
        }
    },
};

module.exports = CourseController;
