const router = require("express").Router();
const reviewController = require("./reviewController");

router.get("/", reviewController.getReviewsByCourseId);
router.post("/", reviewController.createReview);

module.exports = router;
