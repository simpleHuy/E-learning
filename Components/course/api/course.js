const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController"); // Import controller
const { ensureAuthenticated } = require("../../Home/middlewares/authencation");
const { ensureGuest } = require("../../Home/middlewares/authencation");

router
    .get("/", CourseController.getCourses) 
    .get("/:id", CourseController.GetCourseDetail)
   

module.exports = router;
