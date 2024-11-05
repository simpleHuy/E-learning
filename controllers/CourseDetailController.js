const mongoose = require("mongoose");
const CourseModel = require("../models/CourseModel");
const ModuleModel = require("../models/ModuleModel");
const LessionModel = require("../models/LessionModel");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const CourseDetailController = {
    GetAllCourses: async (req, res) => {
        try {
            console.log("Fetching courses...");
            const Courses = await CourseModel.find({});
            console.log("Courses fetched:", Courses); // Log danh sách courses
            return res.status(StatusCodes.OK).json(Courses);
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },

    GetCourseDetail: async (req, res) => {
        try {
            const CourseId = req.params.id;
            const Course = await CourseModel.findById(CourseId);
            if (!Course) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
            }

            const Modules = await ModuleModel.find({ CourseId: CourseId });
            const Lessions = await LessionModel.find({
                ModuleId: { $in: Modules.map((module) => module._id) },
            });

            console.log("Course details:", Course);
            console.log("Modules for course:", Modules);
            console.log("Lessions for modules:", Lessions);

            return res
                .status(StatusCodes.OK)
                .json({ Course, Modules, Lessions });
        } catch (error) {
            console.error("Error fetching course detail:", error); // Log error
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },
};

module.exports = CourseDetailController;
