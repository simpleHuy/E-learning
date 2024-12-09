const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
    },
    Comment: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
});

ReviewSchema.statics.GetReviewsByCourseId = async function (CourseId) {
    return this.find({ Course: CourseId }).populate("User");
};

module.exports = mongoose.model("Reviews", ReviewSchema, "Reviews");
