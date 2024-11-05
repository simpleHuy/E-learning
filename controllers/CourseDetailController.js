const mongoose = require("mongoose");
const CourseModel = require("../models/CourseModel");
const ModuleModel = require("../models/ModuleModel");
const LessonModel = require("../models/LessonModel");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const CourseDetailController = {
    GetCourseDetail: async (req, res) => {
        try {
            const CourseId = req.params.id;
            const Course = await CourseModel.findById(CourseId);
            if (!Course) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
            }

            await Course.FetchAllModules();
            for (let i = 0; i < Course.Modules.length; i++) {
                const Module = Course.Modules[i];
                await Module.FetchAllLessons();
            }

            return res
                .status(StatusCodes.OK)
                .render("CourseDetail", { Course });
        } catch (error) {
            console.error("Error fetching course detail:", error); // Log error
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },
};

module.exports = CourseDetailController;
