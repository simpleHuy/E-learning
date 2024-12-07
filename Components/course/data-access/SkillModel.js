const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
});

SkillSchema.statics.GetAllSkills = async function () {
    return this.find().sort({ Name: 1 });
};

const SkillModel = mongoose.model("Skills", SkillSchema, "Skills");
module.exports = SkillModel;