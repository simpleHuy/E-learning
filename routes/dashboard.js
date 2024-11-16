const express = require("express");
const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Dashboard route with authentication middleware
router.get("/dashboard", isAuthenticated, (req, res) => {
    res.render("pages/dashboard", {
        layout: "dashboardLayout",
        user: req.user,
    });
});

module.exports = router;
