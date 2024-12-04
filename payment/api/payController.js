const Payment = require("../data-access/PayModel");
const Cart = require("../../cart/data-access/CartModel")

const paymentController = {
    getPayment: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // Lấy dữ liệu thanh toán từ database
                const cart = await Cart.GetCartByUserId(req.user.id); // Hàm này cần được định nghĩa trong model
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
                    const discountPrice = course.Price - (course.Price * (course.Sale / 100)); // Tính giá sau giảm
                    return sum + discountPrice;
                }, 0);
    
                // Thêm trường discountPrice vào các khóa học trong giỏ hàng
                const paidCourses = cart.items.map(course => {
                    const discountPrice = course.Price - (course.Price * (course.Sale / 100)); // Tính giá đã giảm
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
            res.status(500).send("An error occurred while processing payment data.");
        }
    },
    
    getPaymentData: async (req, res) => {
        if (req.session.isLoggedIn) {
            const payment = await Payment.GetPaymentByUserId(req.user.id);
            await payment.FetchAllCourses();
            const courses = payment.items;
            res.json({
                isLoggedIn: true,
                courses,
                total: payment.calcTotal(),
            });
        } else {
            res.json({ isLoggedIn: false });
        }
    },
    syncPayment: async (req, res) => {
        const { payment } = req.body;
        const payments = await Payment.GetPaymentByUserId(req.user.id);
        if (payments.items.length === 0) {
            payments.items = payment;
            await payments.save();
            return;
        }
        console.log("Received payment:", payment.length);

        payment.forEach((item) => {
            const existingItem = payments.items.find((i) => i._id == item._id);
            if (!existingItem) {
                payments.items.push(item);
            }
        });
        console.log("Updated payment:", payments.items.length);
        await payments.save();
    },
    payHistory: async (req, res) => {
        try {
            const courseId = req.params.id;
            console.log("Removing course:", courseId);
            const payment = await Payment.GetPaymentByUserId(req.user.id);
            console.log("Payment items:", payment.items);
            await payment.RemoveCourse(courseId);
            await payment.save();
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

            // 1. Lưu các khóa học vào bảng Payments
            const payment = new Payment({
                userId: userId,
                items: courses, // Các khóa học từ frontend
                total: courses.reduce((sum, course) => sum + course.Price, 0), // Tính tổng tiền
            });

            await payment.save(); // Lưu vào Payments

            // 2. Xóa các khóa học khỏi bảng Cart
            await Cart.updateOne(
                { userId: userId },
                { $pull: { items: { $in: courses.map(course => course._id) } } } // Xóa các khóa học đã thanh toán
            );

            // 3. Quay về trang chủ
            res.status(200).send({ message: "Checkout completed successfully" });
        } catch (error) {
            console.error("Error in completeCheckout:", error);
            res.status(500).send("An error occurred while completing your checkout.");
        }
    }

};

module.exports = paymentController;
