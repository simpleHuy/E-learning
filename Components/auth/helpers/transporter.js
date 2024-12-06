const mailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
console.log("Email:", process.env.EMAIL);
console.log("Password:", process.env.PASS_EMAIL ? "Loaded" : "Not Loaded");
const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL,
    },
});
module.exports = transporter;
