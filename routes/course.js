const express = require("express");
const router = express.Router();
const CourseList = require("../controllers/coursesController"); // Import getCourses
const CourseDetailController = require("../controllers/CourseDetailController");

// Define route to get all courses
router
    .get("/", CourseList.getCourses)
    .get("/:id", CourseDetailController.GetCourseDetail);

module.exports = router;
