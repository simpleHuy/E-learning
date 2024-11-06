const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    ShortDescription: { type: String },
    Duration: { type: Number, required: true },
    Level: { type: String, required: true },
    Img: { type: String },
    Price: { type: Number, required: true },
    Rating: { type: Number, min: 0, max: 5 },
    SkillsGained: { type: [String] },
    Lecturer: { type: String },
}, 
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema, "Courses");
