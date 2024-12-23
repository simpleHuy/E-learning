const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController");
const redisCache = require("../../middlewares/redisCache");

router
    .get("/", CourseController.getCoursesList) 
    .get("/:id", redisCache.CourseDetailCache, CourseController.GetCourseDetail)

module.exports = router;
