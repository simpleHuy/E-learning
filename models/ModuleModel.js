const mongoose = require("mongoose");
const LessonModel = require("./LessonModel");

const ModuleSchema = new mongoose.Schema({
    ModuleName: {
        type: String,
        required: true,
    },
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    Lessons: {
        type: Array,
        required: true,
    },
    Duration: {
        type: Number,
        required: true,
    },
});

ModuleSchema.methods.calcTotalDuration = function () {
    let totalDuration = 0;
    for (let i = 0; i < this.Lessons.length; i++) {
        totalDuration += this.Lessons[i].Duration;
    }
    return totalDuration;
};

ModuleSchema.methods.FetchAllLessons = async function () {
    const Lessons = await LessonModel.find({ ModuleId: this._id });
    this.Lessons = Lessons;
    this.Duration = this.calcTotalDuration();
};

module.exports = mongoose.model("Modules", ModuleSchema, "Modules");
