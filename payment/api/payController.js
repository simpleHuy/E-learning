const Payment = require("../data-access/PayModel");
const Cart = require("../../cart/data-access/CartModel")

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
            // Ensure user is authenticated
            if (!req.user || !req.user.id) {
                console.error("User not authenticated");
                return res.status(401).json({ success: false, message: "User not authenticated" });
            }

            // Fetch payment history for the user
            const paymentHistory = await Payment.find({ userId: req.user.id })
                .populate('items')  // Populate the courses in the payment history
                .sort({ createdAt: -1 });  // Sort by most recent payment first

            if (!paymentHistory) {
                console.log("No payment history found for user:", req.user.id);
            }

            // Fetch cart for the user
            const cart = await Cart.GetCartByUserId(req.user.id);
            if (!cart) {
                console.error("No cart found for user:", req.user.id);
                return res.status(404).json({ success: false, message: "No cart found" });
            }

            // Populate courses in the cart
            await cart.FetchAllCourses();
            const cartCourses = cart.items;

            // Combine the payment history (paid courses) and cart courses (unpaid courses)
            const paidCourses = paymentHistory.map(payment => ({
                ...payment._doc,  // Spread the payment document
                isPaid: true,     // Mark these courses as paid
                courses: payment.items,
            }));

            const unpaidCourses = cartCourses.map(course => ({
                ...course._doc,   // Spread the course document
                isPaid: false,    // Mark these courses as unpaid
            }));

            // Combine both arrays (paid and unpaid courses)
            const allCourses = [...paidCourses, ...unpaidCourses];

            // Render the pay history page with combined courses
            res.render('pages/payhistory', {
                title: 'Payment History',
                isLoggedIn: true,
                courses: allCourses,
            });
        } catch (error) {
            console.error("Error fetching payment history:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    
    

};

module.exports = paymentController;


