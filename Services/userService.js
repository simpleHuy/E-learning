const User = require("../models/UserModel");
const hashPassword = require("../helpers/HashPassword");

const UserService = {
    registerUser: async (req, res) => {
        console.log(req.body); // Kiểm tra nội dung của req.body
        try {
            const { username, email, password } = req.body; // Destructure req.body

            // Kiểm tra nếu các trường không được để trống
            if (!username || !email || !password) {
                req.flash("errorMessage", "All fields are required!");
                return res.redirect("/users/signup");
            }

            // Kiểm tra xem tên đăng nhập đã tồn tại
            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername) {
                req.flash("existUser", "Username already exists!");
                return res.redirect("/users/signup");
            }

            // Kiểm tra xem email đã tồn tại
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                req.flash("existMail", "Email already exists!");
                return res.redirect("/users/signup");
            }

            const hashedPassword = await hashPassword(password); // Hash password

            const user = await new User({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
            });

            await user.save();
            console.log(req.session); // Kiểm tra xem session có tồn tại không
            console.log(typeof req.flash);
            req.flash("successMessage", "Signup successfully!");
            res.redirect("/users/signup"); // Chuyển hướng về trang đăng
        } catch (error) {
            console.error(error);
            req.flash("errorMessage", "Signup failed!");
            res.redirect("/users/signup");
        }
    },
};

module.exports = UserService;
