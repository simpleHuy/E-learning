const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

/* GET home page. */
router
    .get("/", homeController.GetHomePage)
    .get("/signup", homeController.GetSignUpPage)
    .get("/login", homeController.GetLoginPage);

module.exports = router;
