const router = require("express").Router();
const paymentController = require("./payController");
const {
    ensureGuest,
    ensureAuthenticated,
} = require("../../Home/middlewares/authencation");
router
    .get("/", ensureAuthenticated, paymentController.getPayment)
    .get("/signup", ensureGuest, (req, res) => {
        res.render("pages/signup");
    })
    .get("/get", ensureAuthenticated, paymentController.getPaymentData)
    .post("/sync", ensureAuthenticated, paymentController.syncPayment)
    .delete("/remove/:id", ensureAuthenticated, paymentController.removeCourse)
    .get("/payhistory",ensureAuthenticated, paymentController.payHistory)

module.exports = router;
