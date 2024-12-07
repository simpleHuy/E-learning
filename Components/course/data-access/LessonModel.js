const mongoose = require("mongoose");

const LessionSchema = new mongoose.Schema({
    LessonName: {
        type: String,
        required: true,
    },
    Duration: {
        type: Number,
        required: true,
    },
    ModuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modules",
        required: true,
    },
});

const LessonModel = mongoose.model("Lessons", LessionSchema, "Lessons");
module.exports = LessonModel;
