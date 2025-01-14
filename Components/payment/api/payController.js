const PaymentService = require("../domain/PaymentService");
const CartService = require("../../cart/domain/CartService");

const paymentController = {
    getPayment: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // Check if course details are passed as query parameters
                const { courseId, title, price } = req.query;
    
                let paidCourses = [];
                let total = 0;
    
                if (courseId && title && price) {
                    // If course details are passed, add them to paidCourses
                    const discountPrice = parseFloat(price); // Assuming no discount for simplicity
                    paidCourses.push({
                        _id: courseId,
                        Title: title,
                        discountPrice: discountPrice.toFixed(2),
                        Price: discountPrice.toFixed(2) // Assuming no discount for simplicity
                    });
                    total = discountPrice;
                } else {
                    // Otherwise, get the cart from the database
                    const cart = await CartService.GetCartByUserId(req.user.id);
                    if (cart && cart.items.length > 0) {
                        // Calculate total price with discount
                        total = cart.items.reduce((sum, course) => {
                            const discountPrice = course.Price - course.Price * (course.Sale / 100);
                            return sum + discountPrice;
                        }, 0);
    
                        // Add discountPrice field to each course in the cart
                        paidCourses = cart.items.map((course) => {
                            const discountPrice = course.Price - course.Price * (course.Sale / 100);
                            return {
                                ...course._doc,
                                discountPrice: discountPrice.toFixed(2)
                            };
                        });
                    }
                }
    
                res.render("pages/paycourses", {
                    title: "Payment",
                    isLoggedIn: true,
                    paidCourses: paidCourses,
                    total: total.toFixed(2)
                });
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
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
