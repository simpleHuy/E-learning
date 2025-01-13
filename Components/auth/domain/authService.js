const User = require("../data-access/UserModel");
const hashHelper = require("../helpers/HashPassword");
const passport = require("../domain/passport");
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/transporter");
const { verifyUser } = require("../api/authController");
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
                verify: false,
            });
            const token = jwt.sign({ id: user.email }, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });
            const url = process.env.BASE_URL
                ? process.env.BASE_URL + `verify/?token=${token}`
                : `http://localhost:3000/verify/?token=${token}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: "[E Learning] Verify your account",
                html: `Please click this link to verify your account: <a href="${url}">${url}</a>`,
            };
            await transporter.sendMail(mailOptions);
            req.flash(
                "successMessage",
                "Signup successfully! Please check your email to verify your account."
            );
            res.cookie("verify-token", token, {
                maxAge: 60 * 60 * 60,
                httpOnly: true,
                secure: true,
            });
            await user.save();
            res.redirect("/signup"); // Chuyển hướng về trang đăng
        } catch (error) {
            console.error(error);
            req.flash("errorMessage", "Signup failed!");
            res.redirect("/signup");
        }
    },
    verifyUser: async (req, res) => {
        try {
            const token = req.query.token;
            if (!token) {
                req.flash("errorMessage", "Token not found!");
                return res.redirect("/signup");
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findOne({ email: decoded.id });
            if (!user) {
                req.flash("errorMessage", "User not found!");
                return res.redirect("/signup");
            }
            if (user.verify) {
                res.clearCookie("verify-token");
                req.flash("warningMessage", "User already verified!");
                return res.redirect("/login");
            }
            user.verify = true;
            await user.save();
            req.flash("successMessage", "Verify successfully!");
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            req.flash("errorMessage", "Verify failed!");
            return res.redirect("/signup");
        }
    },
    loginUser: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.error(err);
                req.flash("errorMessage", "Login failed!");
                return res.redirect("/login");
            }
            if (info && info.type === "verify") {
                res.cookie("verify-token", info.token, {
                    maxAge: 60 * 60 * 60,
                    httpOnly: true,
                    secure: true,
                });
                req.flash("warningMessage", info.message);
                return res.redirect("/login");
            }
            if (!user) {
                req.flash("errorMessage", "Username or password is incorrect!");
                return res.redirect("/login");
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("errorMessage", "Login failed!");
                    return res.redirect("/login");
                }
                req.flash("successMessage", "Login successfully!");
                req.session.isLoggedIn = true;
                return res.redirect("/");
            });
        })(req, res, next);
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                req.flash("errorMessage", "Email not found!");
                return res.redirect("/forgot-password");
            }
            const token = jwt.sign({ id: user.email }, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });
            const url = process.env.BASE_URL
                ? process.env.BASE_URL + `verify/?token=${token}`
                : `http://localhost:3000/verify/?token=${token}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: "[E Learning] Reset your password",
                html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
            };
            await transporter.sendMail(mailOptions);
            res.cookie("token", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                secure: false,
            });
            req.flash(
                "successMessage",
                "Please check your email to reset your password!"
            );
            return res.redirect("/forgot-password");
        } catch (error) {
            console.error(error);
            req.flash("errorMessage", "Forgot password failed!");
            return res.redirect("/forgot-password");
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password, repassword } = req.body;
            if (password !== repassword) {
                req.flash("errorMessage", "Passwords do not match!");
                return res.redirect("/reset-password");
            }
            const token = req.cookies.token;
            console.log(token);
            if (!token) {
                req.flash("errorMessage", "User not found!");
                return res.redirect("/forgot-password");
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decoded.id);
            const user = await User.findOne({ email: decoded.id });
            if (!user) {
                req.flash("errorMessage", "User not found!");
                return res.redirect("/forgot-password");
            }
            const hashedPassword = await hashHelper.HashPassword(
                req.body.password
            );
            user.password = hashedPassword;
            await user.save();
            res.clearCookie("token");
            req.flash("successMessage", "Reset password successfully!");
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            req.flash("errorMessage", "Reset password failed!");
            return res.redirect("/forgot-password");
        }
    },
};

module.exports = UserService;
