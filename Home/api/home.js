const express = require("express");
const router = express.Router();
const homeController = require("./homeController");
const {
    ensureAuthenticated,
    ensureGuest,
} = require("../middlewares/authencation");

/* GET home page. */
router
    .get("/", homeController.GetHomePage)
    .get("/signup", homeController.GetSignUpPage)
    .get("/login", homeController.GetLoginPage)
    .get("/reset-password", homeController.GetResetPasswordPage)
    .get("/forgot-password", homeController.GetForgotPasswordPage);

module.exports = router;
