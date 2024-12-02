const Cart = require("../data-access/CartModel");

const cartController = {
    getCart: async (req, res) => {
        if (req.session.isLoggedIn) {
            res.render("pages/cart", {
                title: "Cart",
                isLoggedIn: true,
            });
        } else {
            res.render("pages/cart", { title: "Cart", isLoggedIn: false });
        }
    },
    getCartData: async (req, res) => {
        if (req.session.isLoggedIn) {
            const cart = await Cart.GetCartByUserId(req.user.id);
            await cart.FetchAllCourses();
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
        const carts = await Cart.GetCartByUserId(req.user.id);
        if (carts.items.length === 0) {
            carts.items = cart;
            await carts.save();
            return;
        }
        console.log("Received cart:", cart.length);

        cart.forEach((item) => {
            const existingItem = carts.items.find((i) => i._id == item._id);
            if (!existingItem) {
                carts.items.push(item);
            }
        });
        console.log("Updated cart:", carts.items.length);
        await carts.save();
    },
    removeCourse: async (req, res) => {
        try {
            const courseId = req.params.id;
            console.log("Removing course:", courseId);
            const cart = await Cart.GetCartByUserId(req.user.id);
            console.log("Cart items:", cart.items);
            await cart.RemoveCourse(courseId);
            await cart.save();
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error removing course:", error);
            res.status(500).json({ success: false });
        }
    },
};

module.exports = cartController;
