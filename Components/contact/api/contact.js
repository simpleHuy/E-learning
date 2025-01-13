const router = require("express").Router();
const contactController = require("./contactController");

router.get("/", contactController.getContact);

module.exports = router;
