const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        password: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        contact: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema, "Users");

module.exports = User;
