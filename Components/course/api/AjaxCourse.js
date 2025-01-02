const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController");
const redisCache = require("../../middlewares/redisCache");

router
    .post("/add-to-cart", CourseController.AddToCart)
    .get(
        "/course-list-data",
        redisCache.CourseListCache,
        CourseController.GetCourseData
    );


module.exports = router;
