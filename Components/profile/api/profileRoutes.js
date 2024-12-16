const express = require("express");
const profileController = require("../api/profileController");
const router = express.Router();
const { ensureAuthenticated } = require("../../Home/middlewares/authencation");
router.get("/", ensureAuthenticated, profileController.GetProfilePage);
router.post("/update", ensureAuthenticated, profileController.UpdateProfile);

module.exports = router;
