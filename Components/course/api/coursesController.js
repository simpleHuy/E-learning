const CourseService = require("../domain/courseService");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

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

            // Render the Handlebars template with pagination and courses data
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
            const { title, Course, relevantCourses } =
                await CourseService.getCourseDetail(CourseId);
            return res.status(StatusCodes.OK).render("pages/CourseDetail", {
                title: title,
                Course: Course,
                RelevantCourses: relevantCourses,
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
            console.log("Received courseid:", courseid); // Log dữ liệu gửi từ client
            const result = await CourseService.AddToCart(courseid);
            if (!result) {
                console.log("Course not found for id:", courseid);
                return res
                    .status(404)
                    .json({ success: false, message: "Course not found" });
            }
            console.log("Course found:", result);
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
