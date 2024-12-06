const validator = require("validator");

const ValidationUser = {
    validateUsername: (username) => {
        console.log("Username:", username);
        console.log("IsAlpha:", validator.isAlpha(username));
        return validator.isAlpha(username);
    },
    validateEmail: (email) => {
        return validator.isEmail(email);
    },
    validatePassword: (password) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    },
};
module.exports = ValidationUser;
