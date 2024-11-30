const User = require("../data-access/UserModel");
const hashHelper = require("../helpers/HashPassword");
const passport = require("../domain/passport");
const UserService = {
    registerUser: async (req, res) => {
        console.log(req.body); // Kiểm tra nội dung của req.body
        try {
            const { username, email, password } = req.body; // Destructure req.body

            // Kiểm tra nếu các trường không được để trống
            if (!username || !email || !password) {
                req.flash("errorMessage", "All fields are required!");
                return res.redirect("/signup");
            }

            // Kiểm tra xem tên đăng nhập đã tồn tại
            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername) {
                req.flash("existUser", "Username already exists!");
                return res.redirect("/signup");
            }

            // Kiểm tra xem email đã tồn tại
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                req.flash("existMail", "Email already exists!");
                return res.redirect("/signup");
            }

            const hashedPassword = await hashHelper.HashPassword(password); // Hash password

            const user = await new User({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
            });

            await user.save();
            console.log(req.session); // Kiểm tra xem session có tồn tại không
            console.log(typeof req.flash);
            req.flash("successMessage", "Signup successfully!");
            res.redirect("/signup"); // Chuyển hướng về trang đăng
        } catch (error) {
            console.error(error);
            req.flash("errorMessage", "Signup failed!");
            res.redirect("/signup");
        }
    },

    loginUser: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.error(err);
                req.flash("errorMessage", "Login failed!");
                return res.redirect("/login");
            }
            if (!user) {
                req.flash(
                    "errorMessage",
                    info.message || "Username or password is incorrect!"
                );
                return res.redirect("/login");
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("errorMessage", "Login failed!");
                    return res.redirect("/login");
                }
                req.flash("successMessage", "Login successfully!");
                return res.redirect("/dashboard");
            });
        })(req, res, next);
    },
};

module.exports = UserService;
