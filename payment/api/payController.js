const Payment = require("../data-access/PayModel");

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
    removeCourse: async (req, res) => {
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
};

module.exports = paymentController;
