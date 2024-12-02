const router = require("express").Router();
const cartController = require("./cartController");
const { ensureGuest } = require("../../Home/middlewares/authencation");
router.get("/", ensureGuest, cartController.getCart);

module.exports = router;
