const express = require("express");
const profileController = require("../api/profileController");
const router = express.Router();
const { ensureAuthenticated } = require("../../Home/middlewares/authencation");
const upload = require("../../middlewares/multer");

router.get("/", ensureAuthenticated, profileController.GetProfilePage);
router.post(
    "/update",
    ensureAuthenticated,
    upload.single("Image"),
    profileController.UpdateProfile
);

module.exports = router;
