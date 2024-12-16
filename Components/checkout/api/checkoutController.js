const Payment = require("../../payment/data-access/PayModel");
const Cart = require("../.././cart/data-access/CartModel");

const checkoutController = {
    completeCheckout: async (req, res) => {
        const userId = req.user?.id; // Kiểm tra thông tin user trong session
        const { courses } = req.body; // Lấy danh sách khóa học từ frontend

        try {
            if (!courses || courses.length === 0) {
                return res.status(400).json({ message: "No courses to process." });
            }

            // Lưu các khóa học vào bảng Payments
            const payment = new Payment({
                userId: userId,
                items: courses,
                total: courses.reduce(
                    (sum, course) => sum + parseFloat(course.Price),
                    0
                ),
            });

            await payment.save();

            // Xóa các khóa học khỏi bảng Cart
            await Cart.updateOne(
                { userId: userId },
                { $pull: { items: { $in: courses.map((course) => course._id) } } }
            );

            res.status(200).json({ message: "Checkout completed successfully" });
        } catch (error) {
            console.error("Error in completeCheckout:", error);
            res.status(500).json({
                message: "An error occurred while processing your checkout.",
            });
        }
    },
};

module.exports = checkoutController;
