const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Topics", TopicSchema, "Topics");