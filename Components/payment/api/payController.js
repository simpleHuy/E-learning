const PaymentService = require("../domain/PaymentService");

const paymentController = {
    getPayment: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // Lấy dữ liệu thanh toán từ database
                const cart = await PaymentService.GetCartByUserId(req.user.id); // Hàm này cần được định nghĩa trong model
                if (!cart || cart.items.length === 0) {
                    return res.render("pages/paycourses", {
                        title: "Payment",
                        isLoggedIn: true,
                        paidCourses: [], // Giỏ hàng trống
                        total: 0,
                    });
                }

                // Tính toán tổng tiền với giá đã giảm
                const total = cart.items.reduce((sum, course) => {
                    const discountPrice =
                        course.Price - course.Price * (course.Sale / 100); // Tính giá sau giảm
                    return sum + discountPrice;
                }, 0);

                // Thêm trường discountPrice vào các khóa học trong giỏ hàng
                const paidCourses = cart.items.map((course) => {
                    const discountPrice =
                        course.Price - course.Price * (course.Sale / 100); // Tính giá đã giảm
                    return {
                        ...course._doc, // Giữ lại các thuộc tính ban đầu của khóa học
                        discountPrice: discountPrice.toFixed(2), // Thêm giá sau giảm vào mỗi khóa học
                    };
                });

                res.render("pages/paycourses", {
                    title: "Payment",
                    isLoggedIn: true,
                    paidCourses: paidCourses, // Giỏ hàng với giá đã giảm
                    total: total.toFixed(2), // Tổng tiền đã giảm
                });
            } else {
                // Người dùng chưa đăng nhập
                res.render("pages/paycourses", {
                    title: "Payment",
                    isLoggedIn: false,
                    paidCourses: [], // Giỏ hàng trống
                    total: 0,
                });
            }
        } catch (error) {
            console.error("Error in getPayment:", error);
            res.status(500).send(
                "An error occurred while processing payment data."
            );
        }
    },
    removeCourse: async (req, res) => {
        try {
            const courseId = req.params.id;
            const userId = req.user.id;
            await PaymentService.removeCourse(userId, courseId);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error removing course:", error);
            res.status(500).json({ success: false });
        }
    },
    completeCheckout: async (req, res) => {
        try {
            const userId = req.user.id; // Giả sử bạn đã có thông tin người dùng trong session
            const { courses } = req.body; // Lấy danh sách khóa học từ frontend

            await PaymentService.completeCheckout(userId, courses);

            // 3. Quay về trang chủ
            res.status(200).send({
                message: "Checkout completed successfully",
            });
        } catch (error) {
            console.error("Error in completeCheckout:", error);
            res.status(500).send(
                "An error occurred while completing your checkout."
            );
        }
    },
    // New payHistory method to fetch payment history
    payHistory: async (req, res) => {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (!req.user || !req.user.id) {
                console.error("User not authenticated");
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }

            // Lấy lịch sử thanh toán của người dùng
            const paymentHistory = await PaymentService.getPaymentHistory(
                req.user.id
            );

            // Render trang lịch sử thanh toán với tất cả khóa học và giá đã giảm
            res.render("pages/payhistory", {
                title: "Payment History",
                isLoggedIn: true,
                paidCourses: paymentHistory.items, // Pass the array of courses for the view with discount
            });
        } catch (error) {
            console.error("Error fetching payment history:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};

module.exports = paymentController;
