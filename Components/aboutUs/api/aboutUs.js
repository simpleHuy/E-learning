const router = require("express").Router();
const aboutController = require("./aboutController");
router.get("/", aboutController.getAboutUs);

module.exports = router;
