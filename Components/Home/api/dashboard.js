const express = require("express");
const router = express.Router();
const {
    ensureAuthenticated,
    ensureGuest,
} = require("../middlewares/authencation");
// Dashboard route with authentication middlewares
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("pages/dashboard", {
        layout: "dashboardlayout",
        user: req.user,
    });
});
router.post("/logout", ensureAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Lỗi khi logout:", err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Lỗi khi xóa session:", err);
                return next(err);
            }
            console.log("Session đã bị xóa");
            res.clearCookie("connect.sid"); // Xóa cookie chứa session ID
            res.redirect("/");
        });
    });
});

module.exports = router;
