const express = require("express");
const profileController = require("../api/profileController");
const router = express.Router();

router.get("/", profileController.GetProfilePage);
router.post("/update", profileController.UpdateProfile);

module.exports = router;
