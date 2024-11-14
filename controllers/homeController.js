const Course = require("../models/CourseModel");
const express = require("express");

const HomeController = {
    GetHomePage: async (req, res) => {
        try {
            const Courses = await Course.find().limit(6);
            return res.status(200).render("pages/home", {
                title: "E-Learning Website",
                Courses: Courses,
            });
        } catch (error) {
            console.error("Error fetching courses:", error); // Log error
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
};
module.exports = HomeController;
