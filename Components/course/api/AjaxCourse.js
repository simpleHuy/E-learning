const router = require("express").Router();
const CourseModel = require("../data-access/CourseModel");

router.post("/add-to-cart", async (req, res) => {
    try {
        const { courseid } = req.body;
        console.log("Received courseid:", courseid); // Log dữ liệu gửi từ client
        const result = await CourseModel.GetCourseById(courseid);
        await result.FetchAllModules();
        if (!result) {
            console.log("Course not found for id:", courseid);
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        }
        console.log("Course found:", result);
        res.status(200).json({
            success: true,
            message: "Added to cart",
            course: result,
        });
    } catch (error) {
        console.error("Error in add-to-cart API:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
module.exports = router;
