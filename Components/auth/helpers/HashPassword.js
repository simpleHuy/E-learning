const bcrypt = require("bcrypt");
const saltRounds = 10;
const hashHelper = {
    HashPassword: async (password) => {
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (error) {
            console.error("Error hashing password:", error);
            return null;
        }
    },
    ComparePassword: async (password, hashedPassword) => {
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            return match;
        } catch (error) {
            console.error("Error comparing password:", error);
            return false;
        }
    },
};
module.exports = hashHelper;
