function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Cho phép tiếp tục nếu người dùng đã xác thực
    }
    res.redirect("/login"); // Chuyển hướng tới /login nếu chưa xác thực
}

function ensureGuest(req, res, next) {
    if (!req.isAuthenticated()) {
        return next(); // Cho phép tiếp tục nếu người dùng chưa xác thực
    }
    req.session.isLoggedIn = true;
    return next();
}

module.exports = { ensureAuthenticated, ensureGuest };
