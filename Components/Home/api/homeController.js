const Course = require("../../course/data-access/CourseModel");
const express = require("express");

const HomeController = {
    GetHomePage: async (req, res) => {
        try {
            const Courses = await Course.find().sort({ Sale: -1 }).limit(6);
            if (req.user) {
                return res.status(200).render("pages/home", {
                    title: "E-Learning Website",
                    Courses: Courses,
                    user: req.user,
                });
            }
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
    GetForgotPasswordPage: (req, res) => {
        return res.status(200).render("pages/forgotpass", {
            title: "Forgot Password",
        });
    },
    GetResetPasswordPage: (req, res) => {
        return res.status(200).render("pages/resetpass", {
            title: "Reset Password",
        });
    },
};
module.exports = HomeController;
