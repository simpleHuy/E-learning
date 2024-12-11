const ReviewModel = require("../data-access/ReviewModel");
const UserModel = require("../../auth/data-access/UserModel");
const CourseModel = require("../../course/data-access/CourseModel");
// Get all reviews for a course
const ReviewService = {
    getReviewsByCourseId: async (courseId, page, limit) => {
        try {
            const reviews = await ReviewModel.find({ Course: courseId })
                .populate("User")
                .sort({ Date: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
            const totalReviews = await ReviewModel.countDocuments({
                Course: courseId,
            });
            console.log(reviews);
            const totalPages = Math.ceil(totalReviews / limit);
            return { reviews, totalPages };
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw new Error("An error occurred while fetching reviews.");
        }
    },
    createReview: async (req, res) => {
        const { User, Course, Comment } = req.body;
        const newReview = new ReviewModel({
            User,
            Course,
            Comment,
            Date: new Date(),
        });
        if (UserModel.find({ _id: User }).length === 0) {
            throw new Error("User not found");
        }
        if (CourseModel.find({ _id: Course }).length === 0) {
            throw new Error("Course not found");
        }
        if (!newReview) {
            throw new Error("Error creating review");
        }
        return newReview.save();
    },
};

module.exports = ReviewService;
