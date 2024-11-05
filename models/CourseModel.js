const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Duration: {
        type: Number,
        required: true,
    },
    Level: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    ShortDesc: {
        type: String,
        required: true,
    },
    Img: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    Rate: {
        type: Number,
        required: true,
    },
    SkillGain: {
        type: Array,
        required: true,
    },
    Lecturer: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Courses", CoursesSchema, "Courses");
