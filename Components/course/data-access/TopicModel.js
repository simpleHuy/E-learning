const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
});

TopicSchema.statics.GetAllTopics = async function () {
    return this.find().sort({ Name: 1 });
};

const TopicModel = mongoose.model("Topics", TopicSchema, "Topics");
module.exports = TopicModel;
