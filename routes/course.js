const express = require("express");
const router = express.Router();
const { getCourses } = require("../controllers/coursesController"); // Import getCourses

// Define route to get all courses
router.get("/", getCourses);

module.exports = router;
