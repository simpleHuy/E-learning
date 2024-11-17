const mongoose = require("mongoose");
const ModuleModel = require("./ModuleModel");
const TopicModel = require("./TopicModel");
const SkillModel = require("./SkillModel");

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
    SkillGain: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skills",
            required: true,
        },
    ],
    Lecturer: {
        type: String,
        required: true,
    },
    Modules: {
        type: Array,
        required: true,
    },
    Topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topics",
        required: true,
    },
});

CoursesSchema.statics.GetCourseById = async function (CourseId) {
    return await this.findById(CourseId)
        .populate("Topic")
        .populate("SkillGain", "Name");
};

CoursesSchema.methods.FetchAllModules = async function () {
    const Modules = await ModuleModel.find({ CourseId: this._id });
    this.Modules = Modules;
};

CoursesSchema.methods.FetchAllSkillGains = async function () {};

CoursesSchema.methods.calcTotalTime = function () {
    let totalTime = 0;
    for (let i = 0; i < this.Modules.length; i++) {
        totalTime += this.Modules[i].calcTotalDuration();
    }
    return totalTime;
};

CoursesSchema.methods.GetAllRelevantCourses = async function (CourseId) {
    const Course = await this.model("Courses").findById(CourseId);

    if (!Course) {
        throw new Error("Course not found");
    }

    const RelevantCoursesByTopic = await this.model("Courses").find({
        Topic: Course.Topic,
        _id: { $ne: CourseId },
    });

    const RelevantCoursesBySkill = await this.model("Courses").find({
        SkillGain: { $in: Course.SkillGain },
        _id: { $ne: CourseId },
    });

    const allRelevantCourses = [
        ...RelevantCoursesByTopic,
        ...RelevantCoursesBySkill,
    ];

    const uniqueRelevantCourses = allRelevantCourses
        .filter(
            (value, index, self) =>
                index ===
                self.findIndex((t) => t._id.toString() === value._id.toString())
        )

    return uniqueRelevantCourses;
};

module.exports = mongoose.model("Courses", CoursesSchema, "Courses");
