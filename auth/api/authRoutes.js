const express = require("express");
const router = express.Router();
const authController = require("./authController");

/* GET signup page. */
router
    .post("/signup", authController.registerUser)
    .post("/login", authController.loginUser)
    .get("/auth/google", authController.googleLogin)
    .get("/auth/google/callback", authController.googleCallback);

module.exports = router;
