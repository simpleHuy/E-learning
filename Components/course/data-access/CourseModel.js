const mongoose = require("mongoose");
const ModuleModel = require("./ModuleModel");
const TopicModel = require("./TopicModel");
const SkillModel = require("./SkillModel");

const CoursesSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Duration: {
        type: Number,
        required: true,
    },
    Level: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    ShortDesc: {
        type: String,
        required: true,
    },
    Img: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    Rate: {
        type: Number,
        required: true,
    },
    SkillGain: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skills",
            required: true,
        },
    ],
    Lecturer: {
        type: String,
        required: true,
    },
    Modules: {
        type: Array,
        required: true,
    },
    Topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topics",
    },
    Sale: {
        type: Number,
        required: true,
    },
});

CoursesSchema.statics.GetCourseById = async function (CourseId) {
    return await this.findById(CourseId)
        .populate("Topic")
        .populate("SkillGain", "Name");
};

CoursesSchema.methods.FetchAllModules = async function () {
    const Modules = await ModuleModel.find({ CourseId: this._id });
    this.Modules = Modules;
};

CoursesSchema.methods.calcTotalTime = function () {
    let totalTime = 0;
    for (let i = 0; i < this.Modules.length; i++) {
        totalTime += this.Modules[i].calcTotalDuration();
    }
    return totalTime;
};

CoursesSchema.statics.GetAllRelevantCourses = async function (CourseId) {
    // Lấy khóa học hiện tại
    const CurrentCourse = await this.findById(CourseId);
    // Lấy các khóa học theo Topic
    const RelevantCoursesByTopic = await this.model("Courses").find({
        Topic: CurrentCourse.Topic,  // Sử dụng `this.Topic` để lấy Topic của khóa học hiện tại
        _id: { $ne: CurrentCourse._id },  // Đảm bảo không lấy chính khóa học này
    });

    // Lấy các khóa học theo SkillGain
    const RelevantCoursesBySkill = await this.model("Courses").find({
        SkillGain: { $in: CurrentCourse.SkillGain },  // Sử dụng `this.SkillGain` để lấy SkillGain của khóa học hiện tại
        _id: { $ne: CurrentCourse._id },  // Đảm bảo không lấy chính khóa học này
    });

    // Kết hợp các khóa học liên quan
    const allRelevantCourses = [
        ...RelevantCoursesByTopic,
        ...RelevantCoursesBySkill,
    ];

    // Lọc các khóa học trùng lặp
    const uniqueRelevantCourses = allRelevantCourses.filter(
        (value, index, self) =>
            index === self.findIndex((t) => t._id.toString() === value._id.toString())
    );

    return uniqueRelevantCourses;
};

CoursesSchema.statics.createCourseQuery = async function (filters) {
    const { search, topic, skill, level, price } = filters;
    let query = {};

    // Search filter
    if (search) {
        query.$or = [
            { Title: { $regex: search, $options: "i" } },
            { Description: { $regex: search, $options: "i" } },
            { Lecturer: { $regex: search, $options: "i" } },
            { Level: { $regex: search, $options: "i" } },
        ];
    }

    // Topic filter
    if (topic) {
        const topics = await TopicModel.find({ Name: { $in: topic } });
        query.Topic = { $in: topics.map((t) => t._id) };
    }

    // Skill filter
    if (skill) {
        const skills = await SkillModel.find({ Name: { $in: skill } });
        query.SkillGain = { $in: skills.map((s) => s._id) };
    }

    // Level filter
    if (level) {
        query.Level = { $in: level };
    }

    // Price filter
    if (price) {
        const [minPrice, maxPrice] = price.split(",").map((p) => parseInt(p));
        query.Price = {
            $gte: Math.min(minPrice, maxPrice),
            $lte: Math.max(minPrice, maxPrice),
        };
    }

    return query;
};

CoursesSchema.statics.GetCoursesByFilter = async function (
    search = null,
    topic = null,
    skill = null,
    level = null,
    price = null,
    sort = null,
    order = "asc",
    page = 1
) {
    const ITEMS_PER_PAGE = 6;

    const query = await this.createCourseQuery({
        search,
        topic,
        skill,
        level,
        price,
    });

    if (sort === null) return this.find(query);

    const validSortFields = ["Title", "Duration", "Price"];
    let sortOption = {};
    if (sort && validSortFields.includes(sort)) {
        sortOption[sort] = order === "desc" ? -1 : 1;
    } else {
        sortOption["Title"] = 1; // Default sort by Title ascending
    }

    //pagging
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    const courses = await this.find(query)
        .sort(sortOption)
        .skip(startIndex)
        .limit(ITEMS_PER_PAGE);
    const totalCourses = await this.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE);

    return {
        courses,
        totalPages,
    };
};

const CourseModel = mongoose.model("Courses", CoursesSchema, "Courses");
module.exports = CourseModel;
