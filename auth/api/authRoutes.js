const express = require("express");
const router = express.Router();
const authController = require("./authController");

/* GET signup page. */
router
    .post("/signup", authController.registerUser)
    .get("/verify", authController.verifyUser)
    .post("/login", authController.loginUser)
    .post("/forgot-password", authController.forgotPassword)
    .post("/reset-password", authController.resetPassword)
    .get("/auth/google", authController.googleLogin)
    .get("/auth/google/callback", authController.googleCallback);

module.exports = router;
