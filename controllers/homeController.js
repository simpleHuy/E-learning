const Course = require("../models/CourseModel");
const express = require("express");

const HomeController = {
    GetHomePage: async (req, res) => {
        try {
            const Courses = await Course.find().sort({ Sale: -1 }).limit(6);
            console.log(Courses);
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
    GetSignUpPage: (req, res) => {
        return res.status(200).render("pages/signup", {
            title: "Sign Up",
        });
    },
    GetLoginPage: (req, res) => {
        return res.status(200).render("pages/login", {
            title: "Login",
        });
    },
};
module.exports = HomeController;
