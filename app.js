const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const db = require("./config/database");
const redisClient = require("./config/redis");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const MongoStore = require("connect-mongo");
const passport = require("./Components/auth/domain/passport");

// Require routers
const homeRouter = require("./Components/Home/api/home");
const authRouter = require("./Components/auth/api/authRoutes");
const paymentRouter = require("./Components/payment/api/pay");
const coursesRouter = require("./Components/course/api/course");
const dashboardRoutes = require("./Components/Home/api/dashboard");
const cartRoutes = require("./Components/cart/api/cart");
const profileRouter = require("./Components/profile/api/profileRoutes");
const checkoutRouter = require("./Components/checkout/api/checkout");
// AJAX API
const validate = require("./Components/validate/api/validate");
const AjaxCourseRouter = require("./Components/course/api/AjaxCourse");
const Payment = require("./Components/payment/data-access/PayModel");
const Cart = require("./Components/cart/data-access/CartModel");
const ReviewRouter = require("./Components/review/api/review");
const contactRouter = require("./Components/contact/api/contact");
const aboutUsRouter = require("./Components/aboutUs/api/aboutUs");
const app = express();
db.connect();
redisClient.connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));

//helpers
require("./views/helpers/CourseHelper");
require("./views/helpers/CoponentsHelper");

hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: process.env.SECRET_KEY, // Khóa bí mật dùng để mã hóa session
        resave: false, // Không lưu session nếu không có thay đổi
        saveUninitialized: false, // Không lưu session trống
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Thời hạn cookie (1 giờ)
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI, // URL kết nối MongoDB
            collectionName: "sessions", // Tên collection lưu session
        }),
    })
);
// Configure Passport
app.use(passport.initialize());
app.use(passport.session());
hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
});

// Configure flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("successMessage");
    res.locals.errorMessage = req.flash("errorMessage");
    res.locals.warningMessage = req.flash("warningMessage");
    res.locals.existUser = req.flash("existUser");
    res.locals.existMail = req.flash("existMail");
    next();
});

// Configure routes
app.use("/complete-checkout", checkoutRouter);

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    if (req.user) res.locals.user = req.user;
    next();
});
app.use("/validate", validate);
app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/", dashboardRoutes);
app.use("/courses", coursesRouter);
app.use("/paycourses", paymentRouter);
app.use("/cart", cartRoutes);
app.use("/courses/api", AjaxCourseRouter);
app.use("/reviews", ReviewRouter);
app.use("/profile", profileRouter);
app.use("/contact", contactRouter);
app.use("/aboutUs", aboutUsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
