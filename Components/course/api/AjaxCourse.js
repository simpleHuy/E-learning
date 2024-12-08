const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController"); // Import controller

router
    .post("/add-to-cart", CourseController.AddToCart)
    .get("/course-list-data", CourseController.GetCourseData);

module.exports = router;