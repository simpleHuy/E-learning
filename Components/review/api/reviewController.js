const ReviewService = require("../domain/reviewService");

const ReviewController = {
    getReviewsByCourseId: async (req, res) => {
        try {
            const { courseId, page = 1, limit = 5 } = req.query;
            const { reviews, totalPages } =
                await ReviewService.getReviewsByCourseId(courseId, page, limit);
            res.status(200).json({ reviews, totalPages });
        } catch (error) {
            console.error("Error fetching reviews:", error);
            res.status(500).send("An error occurred while fetching reviews.");
        }
    },
    createReview: async (req, res) => {
        try {
            await ReviewService.createReview(req, res);
            res.status(201).json({ message: "Review created successfully." });
        } catch (error) {
            console.error("Error creating review:", error);
            res.status(500).send("An error occurred while creating review.");
        }
    },
};
module.exports = ReviewController;
