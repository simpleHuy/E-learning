const User = require("../../auth/data-access/UserModel");
const bcrypt = require("bcrypt");
const supabase = require("../../../config/supabase");
const passport = require("../../auth/domain/passport");

async function uploadImage(file, filePath) {
    try {
        const { data, error } = await supabase.storage
            .from("SkillBoost")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
                public: true,
            });

        if (error) {
            console.error("Detailed Supabase Error:", {
                message: error.message,
                details: error.details,
                code: error.code,
            });
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Full Error Object:", err);
        throw err;
    }
}
const profileService = {
    findUserById: async (userId) => {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    updateUserProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            console.log("Received data in backend:", req.body);

            const user = await User.findById(userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }
            const { name, email, address, contact, password } = req.body;
            const Img = req.file;

            const updatedData = {};

            if (name) updatedData.name = name;
            if (email) {
                const emailExist = await User.findOne({ email });
                if (emailExist) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists",
                    });
                }
                updatedData.email = email;
            }
            if (address) updatedData.address = address;
            if (contact) updatedData.contact = contact;
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updatedData.password = hashedPassword;
            }
            if (Img) {
                const date = new Date();
                const sanitizedTitle = user.name
                    ?.replace(/[^a-z0-9]/gi, "_")
                    .toLowerCase();
                const filePath = `Avatar/${date.getTime()}_${sanitizedTitle}`;
                await uploadImage(Img, filePath);

                const { data } = supabase.storage
                    .from("SkillBoost")
                    .getPublicUrl(filePath);
                updatedData.Img = data.publicUrl;
            }

            console.log("Updated Data:", updatedData);

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updatedData,
                { new: true }
            );
            // req.user = updatedUser;
            req.session.passport.user = {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                Img: updatedUser.Img,
            };
            if (!updatedUser) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
        }
    },
};

module.exports = profileService;
