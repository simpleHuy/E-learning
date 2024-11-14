const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");

/* GET signup page. */
router
    .get("/signup", function (req, res) {
        res.render("/pages/signup", { title: "Signup" });
    })
    .post("/signup", userController.registerUser);

module.exports = router;
