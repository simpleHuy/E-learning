const router = require("express").Router();
const CourseDetailController = require("../controllers/CourseDetailController");

router.get("/:id", CourseDetailController.GetCourseDetail);

module.exports = router;
