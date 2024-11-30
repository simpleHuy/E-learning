const express = require("express");
const router = express.Router();
const homeController = require("./homeController");
const {
    ensureAuthenticated,
    ensureGuest,
} = require("../middlewares/authencation");

/* GET home page. */
router
    .get("/", ensureGuest, homeController.GetHomePage)
    .get("/signup", homeController.GetSignUpPage)
    .get("/login", homeController.GetLoginPage);

module.exports = router;
