const express = require("express");
const checkoutController = require("./checkoutController");

const router = express.Router();

// Route gọi controller
router
    .post("/", checkoutController.completeCheckout)
    .post("/vnpay_post", checkoutController.vnpayPost);

module.exports = router;
