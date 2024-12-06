const router = require("express").Router();
const validation = require("../helper/validation");

router.post("/", (req, res) => {
    if (!validation.validateEmail(req.body.email)) {
        return res.status(400).json({
            field: "email",
            message: "Invalid Email",
        });
    }
    if (!validation.validatePassword(req.body.password)) {
        return res.status(400).json({
            field: "password",
            message:
                "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        });
    }
    if (!validation.validateUsername(req.body.username)) {
        return res.status(400).json({
            field: "username",
            message: "Username must contain only letters",
        });
    }
    res.status(200).json({
        message: "Validation successful",
    });
});

module.exports = router;
