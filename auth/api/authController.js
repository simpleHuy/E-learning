const express = require("express");
const authService = require("../domain/authService");
const passport = require("../domain/passport");
const authController = {
    registerUser: async (req, res) => {
        try {
            await authService.registerUser(req, res);
        } catch (error) {
            console.error("Error registering user:", error); // Log error
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
    verifyUser: async (req, res) => {
        try {
            await authService.verifyUser(req, res);
        } catch (error) {
            console.error("Error verifying user:", error); // Log error
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
    loginUser: async (req, res, next) => {
        try {
            await authService.loginUser(req, res, next);
        } catch (error) {
            console.error("Error logging in:", error); // Log error
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            await authService.forgotPassword(req, res);
        } catch (error) {
            console.error("Error forgot password:", error); // Log error
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
    resetPassword: async (req, res) => {
        try {
            await authService.resetPassword(req, res);
        } catch (error) {
            console.error("Error resetting password:", error); // Log error
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
    googleLogin: (req, res, next) => {
        passport.authenticate("google", {
            scope: ["profile", "email"],
        })(req, res, next);
    },
    // Handle Google OAuth callback
    googleCallback: (req, res, next) => {
        passport.authenticate(
            "google",
            { failureRedirect: "pages/login" },
            (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect("pages/login");
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect("/dashboard");
                });
            }
        )(req, res, next);
    },
};
module.exports = authController;
