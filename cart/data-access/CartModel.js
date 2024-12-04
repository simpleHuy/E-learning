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
cartSchema.methods.RemoveCourse = async function (courseId) {
    const initialCount = this.items.length;
    // Lọc lại mảng, giữ lại các phần tử không phải là courseId
    this.items = this.items.filter((item) => {
        if (item) {
            return item._id.toString() !== courseId.toString();
        } else {
            console.error("Undefined item found in cart items");
            return true;
        }
    });

    if (this.items.length < initialCount) {
        await this.save(); // Chỉ lưu khi có sự thay đổi
    } else {
        throw new Error("Course not found in cart");
    }
};

cartSchema.methods.FetchAllCourses = async function () {
    const Courses = await this.model("Carts")
        .findById(this._id)
        .populate("items");
    this.items = Courses.items;
    this.calcTotal();
};
cartSchema.statics.GetCartByUserId = async function (UserId) {
    let cart = await this.findOne({ userId: UserId }).populate("items");
    if (!cart) {
        cart = new this({ userId: UserId, items: [], total: 0 });
        await cart.save();
    }
    return cart;
};
module.exports = mongoose.model("Carts", cartSchema, "Carts");
