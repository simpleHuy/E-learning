const CartService = require("../domain/CartService");

const cartController = {
    getCart: async (req, res) => {
        if (req.session.isLoggedIn) {
            res.render("pages/Cart", {
                title: "Cart",
                isLoggedIn: true,
            });
        } else {
            res.render("pages/Cart", { title: "Cart", isLoggedIn: false });
        }
    },

    getCartData: async (req, res) => {
        if (req.session.isLoggedIn) {
            const cart = await CartService.GetCartByUserId(req.user.id);
            const courses = cart.items;
            res.json({
                isLoggedIn: true,
                courses,
                total: cart.calcTotal(),
            });
        } else {
            res.json({ isLoggedIn: false });
        }
    },

    syncCart: async (req, res) => {
        const { cart } = req.body;
        await CartService.syncCart(req.user.id, cart);
        res.status(200).json({ success: true });
    },

    removeCourse: async (req, res) => {
        try {
            const courseId = req.params.id;
            const userId = req.user.id;
            await CartService.RemoveCourse(userId, courseId);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error removing course:", error);
            res.status(500).json({ success: false });
        }
    },
};

module.exports = cartController;
