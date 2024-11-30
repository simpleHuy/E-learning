const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
});

SkillSchema.statics.GetAllSkills = async function () {
    return this.find();
};

module.exports = mongoose.model("Skills", SkillSchema, "Skills");