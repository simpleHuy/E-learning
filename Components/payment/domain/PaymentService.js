const PaymentModel = require("../data-access/PayModel");
const CartModel = require("../../cart/data-access/CartModel");

const PaymentService = {
    getPaymentByUserId: async (userId) => {
        return await PaymentModel.getPaymentByUserId(userId);
    },

    removeCourse: async (userId, courseId) => {
        const payment = await PaymentModel.getPaymentByUserId(userId);
        await payment.RemoveCourse(courseId);
        await payment.save();
    },

    completeCheckout: async (userId, courses) => {
        // 1. Lưu các khóa học vào bảng Payments
        const payment = new PaymentModel({
            userId: userId,
            items: courses, // Các khóa học từ frontend
            total: courses.reduce((sum, course) => sum + course.Price, 0), // Tính tổng tiền
        });

        await payment.save(); // Lưu vào Payments

        // 2. Xóa các khóa học khỏi bảng Cart
        await CartModel.updateOne(
            { userId: userId },
            {
                $pull: {
                    items: { $in: courses.map((course) => course._id) },
                },
            } // Xóa các khóa học đã thanh toán
        );
    },

    getPaymentHistory: async (userId) => {
        // Lấy lịch sử thanh toán của người dùng
        const paymentHistory = await PaymentModel.GetPaymentByUserId(userId);
        await paymentHistory.FetchAllCourses();

        return paymentHistory;
    },
};

module.exports = PaymentService;
