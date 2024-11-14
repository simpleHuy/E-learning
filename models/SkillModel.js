const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Skills", SkillSchema, "Skills");