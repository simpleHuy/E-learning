const User = require("../../auth/data-access/UserModel");
const profileService = require("../domain/profileService");
const bcrypt = require("bcrypt");

const ProfileController = {
    GetProfilePage: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.render("pages/profiles", {
                user,
                title: "Profile Page",
                showSidebar: true,
                showTopbar: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    UpdateProfile: async (req, res) => {
        try {
            if (req.file) {
                console.log("File:", req.file);
            } else {
                console.log("No file uploaded");
            }
            await profileService.updateUserProfile(req, res);
            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
            });
        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = ProfileController;
