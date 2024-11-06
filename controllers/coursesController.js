// coursesController.js
const ITEMS_PER_PAGE = 6;

const Course = require("../models/courseList"); // Adjust this path if necessary

// Function to fetch and display courses with pagination
const getCourses = async (req, res) => {
    try {
        // Get the current page number from the query parameters or set to 1 if not provided
        const page = parseInt(req.query.page) || 1;

        // Fetch the total number of courses to calculate total pages
        const totalCourses = await Course.countDocuments();
        const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE);

        // Calculate pagination details
        const courses = await Course.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        // Prepare pagination variables
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        const isFirstPage = page === 1;
        const isLastPage = page === totalPages;

        // Render the Handlebars template with pagination and courses data
        res.render('courseslist', {
            courses,
            currentPage: page,
            totalPages,
            prevPage,
            nextPage,
            isFirstPage,
            isLastPage,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send("An error occurred while fetching courses.");
    }
};

module.exports = { getCourses };
