const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const db = require("./config/database");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const MongoStore = require("connect-mongo");
const passport = require("./auth/domain/passport");

const homeRouter = require("./Home/api/home");
const authRouter = require("./auth/api/authRoutes");
const coursesRouter = require("./course/api/course");
const dashboardRoutes = require("./Home/api/dashboard");

const app = express();
db.connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));

//helpers
require("./views/helpers/CourseHelper");

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
// Cấu hình Passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("successMessage");
    res.locals.errorMessage = req.flash("errorMessage");
    res.locals.warningMessage = req.flash("warningMessage");
    res.locals.existUser = req.flash("existUser");
    res.locals.existMail = req.flash("existMail");
    next();
});

app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/", dashboardRoutes);

app.use("/courses", coursesRouter);
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
