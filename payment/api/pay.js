const router = require("express").Router();
const paymentController = require("./payController");
const {
    ensureGuest,
    ensureAuthenticated,
} = require("../../Home/middlewares/authencation");
router
    .get("/", ensureAuthenticated, paymentController.getPayment)
    .get("/payhistory", ensureAuthenticated, paymentController.payHistory)
    .get("/signup", ensureGuest, (req, res) => {
        res.render("pages/signup");
    })
    .get("/get", ensureAuthenticated, paymentController.getPaymentData)
    .post("/sync", ensureAuthenticated, paymentController.syncPayment)
    .get("/payhistory", ensureAuthenticated, paymentController.payHistory)
    .post("/complete-checkout", paymentController.completeCheckout)
    .delete("/remove/:id", ensureAuthenticated, paymentController.removeCourse);

module.exports = router;
