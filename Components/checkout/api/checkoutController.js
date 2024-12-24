const PaymentService = require("../domain/paymentService");

const checkoutController = {
    completeCheckout: async (req, res) => {
        const userId = req.user?.id; // Kiểm tra thông tin user trong session
        const { courses, paymentMethod, totalPrice } = req.body; // Lấy danh sách khóa học từ frontend

        try {
            if (!courses || courses.length === 0) {
                return res
                    .status(400)
                    .json({ message: "No courses to process." });
            }
            if (paymentMethod === "vnpay") {
                const rollbackurl = await PaymentService.vnPay(req, res);
                // res.redirect(rollbackurl);
                res.status(200).json({ rollbackurl });
            }
            // else {
            //     const payment = new Payment({
            //         userId: userId,
            //         items: courses,
            //         total: courses.reduce(
            //             (sum, course) => sum + parseFloat(course.Price),
            //             0
            //         ),
            //     });

            //     await payment.save();

            //     // Xóa các khóa học khỏi bảng Cart
            //     await Cart.updateOne(
            //         { userId: userId },
            //         {
            //             $pull: {
            //                 items: { $in: courses.map((course) => course._id) },
            //             },
            //         }
            //     );

            //     res.status(200).json({
            //         message: "Checkout completed successfully",
            //     });
            // }
        } catch (error) {
            console.error("Error in completeCheckout:", error);
            res.status(500).json({
                message: "An error occurred while processing your checkout.",
            });
        }
    },
    vnpayPost: async (req, res) => {
        try {
            await PaymentService.vnpayPost(req, res);
        } catch (error) {
            console.error("Error in vnpayPost:", error);
            res.status(500).json({
                message: "An error occurred while processing your payment.",
            });
        }
    },
};

module.exports = checkoutController;
