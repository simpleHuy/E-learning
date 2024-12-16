const router = require("express").Router();
const reviewController = require("./reviewController");
const { ensureAuthenticated } = require("../../Home/middlewares/authencation");
router.get("/", reviewController.getReviewsByCourseId);
router.post("/", ensureAuthenticated, reviewController.createReview);

module.exports = router;
