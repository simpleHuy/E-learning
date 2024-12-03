const Payment = require("../data-access/PayModel");

// paymentController.js
const paymentController = {
    getPayment: async (req, res) => {
        if (req.session.isLoggedIn) {
            res.render("pages/paycourses", {
                title: "Payment",
                isLoggedIn: true,
            });
        } else {
            res.render("pages/paycourses", { title: "Payment", isLoggedIn: false });
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
        payment.forEach((item) => {
            const existingItem = payments.items.find((i) => i._id == item._id);
            if (!existingItem) {
                payments.items.push(item);
            }
        });
        await payments.save();
    },
    removeCourse: async (req, res) => {
        try {
            const courseId = req.params.id;
            const payment = await Payment.GetPaymentByUserId(req.user.id);
            await payment.RemoveCourse(courseId);
            await payment.save();
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false });
        }
    },
    // New payHistory method to fetch payment history
    payHistory: async (req, res) => {
        try {
            // Fetch the user's payment history
            const paymentHistory = await Payment.find({ userId: req.user.id })
                .populate('items')  // Populate the courses in the payment
                .sort({ createdAt: -1 });
    
            // Fetch the courses in the user's cart (not yet paid)
            const cart = await Cart.GetCartByUserId(req.user.id);  // Fetch cart data
            await cart.FetchAllCourses();
            const cartCourses = cart.items;
    
            // Combine the payment history and cart courses
            const allCourses = paymentHistory.map(payment => ({
                ...payment._doc,
                isPaid: true  // Mark courses as paid
            }));
    
            const unpaidCourses = cartCourses.map(course => ({
                ...course._doc,
                isPaid: false  // Mark courses as not paid
            }));
    
            const allCoursesWithStatus = [...allCourses, ...unpaidCourses];
    
            res.render('pages/payhistory', {
                title: 'Payment History',
                isLoggedIn: true,
                paymentHistory: allCoursesWithStatus,
            });
        } catch (error) {
            console.error("Error fetching payment history:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    

};

module.exports = paymentController;


