const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
            status: {
                type: String,
                enum: ['paid', 'pending'],
                default: 'pending', // New courses added to payment are initially "pending"
            },
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

paymentSchema.methods.calcTotal = function () {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
        total += this.items[i].Price;
    }
    this.total = total;
    return total;
};

paymentSchema.methods.AddCourse = function (CourseId) {
    this.items.push(CourseId);
    this.calcTotal();
};

paymentSchema.methods.AddCourse = async function (CourseId) {
    const course = await this.model("Courses").findById(CourseId); // Lấy khóa học từ database
    if (!course) {
        throw new Error("Course not found");
    }
    this.items.push(course); // Thêm đối tượng khóa học vào giỏ hàng
    this.calcTotal();
};

paymentSchema.methods.RemoveCourse = async function (courseId) {
    // Kiểm tra xem courseId có phải ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error("Invalid course ID");
    }

    const initialCount = this.items.length;
    this.items = this.items.filter((item) => item._id.toString() !== courseId.toString());

    if (this.items.length < initialCount) {
        await this.save();
    } else {
        throw new Error("Course not found in payment");
    }
};


paymentSchema.methods.FetchAllCourses = async function () {
    const payment = await this.model("Payments")
        .findById(this._id)
        .populate("items"); // Populating courses

    this.items = payment.items;
    this.calcTotal();
};

paymentSchema.statics.GetPaymentByUserId = async function (UserId) {
    let payment = await this.findOne({ userId: UserId }).populate("items");
    if (!payment) {
        payment = new this({ userId: UserId, items: [], total: 0 });
        await payment.save();
    } else {
        payment.calcTotal(); // Tính lại tổng nếu đã có giỏ hàng
    }
    return payment;
};

module.exports = mongoose.model("Payments", paymentSchema, "Payments");
