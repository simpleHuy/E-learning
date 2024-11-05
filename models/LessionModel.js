const mongoose = require("mongoose");

const LessionSchema = new mongoose.Schema({
    LessionName: {
        type: String,
        required: true,
    },
    Duration: {
        type: Number,
        required: true,
    },
    ModuleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Lession", LessionSchema);
