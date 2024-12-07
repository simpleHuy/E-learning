const CartModel = require("../data-access/CartModel");

const CartService = {
    GetCartByUserId: async (userId) => {
        const cart = await CartModel.GetCartByUserId(userId);
        await cart.FetchAllCourses();
        return cart;
    },

    RemoveCourse: async (userId, courseId) => {
        const cart = await CartModel.GetCartByUserId(userId);
        await cart.RemoveCourse(courseId);
        await cart.save();
    },

    syncCart: async (userId, cart) => {
        const carts = await CartModel.GetCartByUserId(userId);
        if (carts.items.length === 0) {
            carts.items = cart;
            await carts.save();
            return;
        }

        console.log("Received CartModel:", cart.length);

        cart.forEach((item) => {
            const existingItem = carts.items.find((i) => i._id == item._id);
            if (!existingItem) {
                carts.items.push(item);
            }
        });

        console.log("Updated CartModel:", carts.items.length);
        await carts.save();
    },
};

module.exports = CartService;
