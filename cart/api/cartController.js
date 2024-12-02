const cartController = {
    getCart(req, res) {
        if (req.session.isLoggedIn) {
            const courses = [];
            console.log("Courses in cart:", courses.length);
            res.render("pages/cart", {
                title: "Cart",
                isLoggedIn: true,
                courses,
            });
        } else {
            res.render("pages/cart", { title: "Cart", isLoggedIn: false });
        }
    },
};

module.exports = cartController;
