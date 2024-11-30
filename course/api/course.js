const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController"); // Import getCourses

// Define route to get all courses
router
    .get("/", CourseController.getCourses)
    .get("/:id", CourseController.GetCourseDetail);

module.exports = router;
