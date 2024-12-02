const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
cartSchema.methods.calcTotal = function () {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
        total += this.items[i].Price;
    }
    this.total = total;
    return total;
};
cartSchema.methods.AddCourse = function (CourseId) {
    this.items.push(CourseId);
    this.calcTotal();
};
cartSchema.methods.RemoveCourse = function (CourseId) {
    this.items = this.items.filter((item) => item._id.toString() !== CourseId);
    this.calcTotal();
};
cartSchema.methods.FetchAllCourses = async function () {
    const Courses = await this.model("Carts")
        .findById(this._id)
        .populate("items");
    this.items = Courses.items;
    this.calcTotal();
};
cartsSchema.statics.GetCartByUserId = async function (UserId) {
    return await this.findOne({ userId: UserId }).populate("items");
};
module.exports = mongoose.model("Carts", cartSchema, "Carts");
