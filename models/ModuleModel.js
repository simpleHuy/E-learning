const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
    ModuleName: {
        type: String,
        required: true,
    },
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Module", ModuleSchema);