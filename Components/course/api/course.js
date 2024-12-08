const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController"); // Import controller

router
    .get("/", CourseController.getCourses) 
    .get("/:id", CourseController.GetCourseDetail)
    .post("/add-to-cart", CourseController.AddToCart);

module.exports = router;
