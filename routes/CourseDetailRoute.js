const router = require("express").Router();
const CourseDetailController = require("../controllers/CourseDetailController");

router.get("/courses", CourseDetailController.GetAllCourses);
router.get("/courses/:id", CourseDetailController.GetCourseDetail);

module.exports = router;
