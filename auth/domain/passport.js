const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../data-access/UserModel");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/transporter");
const bcrypt = require("bcrypt");

// Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, {
                        type: null,
                        message: "Incorrect email.",
                    });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, {
                        type: null,
                        message: "Incorrect password.",
                    });
                }
                if (!user.verify) {
                    const token = jwt.sign(
                        { id: user.email },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: "1h",
                        }
                    );
                    const url = `http://localhost:3000/verify/?token=${token}`;
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: user.email,
                        subject: "[E Learning] Verify your account",
                        html: `Please click this link to verify your account: <a href="${url}">${url}</a>`,
                    };
                    await transporter.sendMail(mailOptions);
                    return done(null, false, {
                        type: "verify",
                        token: token,
                        message:
                            "Please check your email to verify your account before logging in.",
                    });
                }
                return done(
                    null,
                    { type: null, message: "Login successfully!" },
                    user
                );
            } catch (error) {
                return done(error);
            }
        }
    )
);

//Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (token, tokenSecret, profile, done) => {
            try {
                let user = await User.findOne({
                    email: profile.emails[0].value,
                });
                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        verify: true,
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, {
        id: user.id,
        username: user.username,
        email: user.email,
    });
});

// Deserialize user
passport.deserializeUser(async (user, done) => {
    try {
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
