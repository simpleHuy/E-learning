const CartModel = require("../data-access/CartModel");

const CartService = {
    GetCartByUserId: async (userId) => {
        const cart = await Cart.GetCartByUserId(userId);
        await cart.FetchAllCourses();
        return cart;
    },

    RemoveCourse: async (userId, courseId) => {
        const cart = await Cart.GetCartByUserId(userId);
        await cart.RemoveCourse(courseId);
        await cart.save();
    },

    syncCart: async (userId, cart) => {
        const carts = await Cart.GetCartByUserId(userId);
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
    }
}

module.exports = CartService;