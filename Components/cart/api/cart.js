const router = require("express").Router();
const cartController = require("./cartController");
const {
    ensureGuest,
    ensureAuthenticated,
} = require("../../Home/middlewares/authencation");
router
    .get("/", ensureGuest, cartController.getCart)
    .get("/get", ensureAuthenticated, cartController.getCartData)
    .post("/sync", ensureAuthenticated, cartController.syncCart)
    .delete("/remove/:id", ensureAuthenticated, cartController.removeCourse);

module.exports = router;
