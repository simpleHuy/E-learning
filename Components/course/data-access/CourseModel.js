const mongoose = require("mongoose");
const ModuleModel = require("./ModuleModel");
const TopicModel = require("./TopicModel");
const SkillModel = require("./SkillModel");
const algoliaClient = require("../../../config/algoliaSearch");

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
    const CurrentCourse = await this.findById(CourseId);
    const RelevantCoursesByTopic = await this.model("Courses").find({
        Topic: CurrentCourse.Topic,
        _id: { $ne: CurrentCourse._id },
    });

    const RelevantCoursesBySkill = await this.model("Courses").find({
        SkillGain: { $in: CurrentCourse.SkillGain },
        _id: { $ne: CurrentCourse._id },
    });

    const allRelevantCourses = [
        ...RelevantCoursesByTopic,
        ...RelevantCoursesBySkill,
    ];

    const uniqueRelevantCourses = allRelevantCourses.filter(
        (value, index, self) =>
            index ===
            self.findIndex((t) => t._id.toString() === value._id.toString())
    );

    return uniqueRelevantCourses;
};

CoursesSchema.statics.createCourseQuery = async function (filters) {
    const { search, topic, skill, level, price } = filters;

    let algoliaQuery = {
        query: search || "", // Ensure query is initialized with search term or an empty string
        filters: "", // Start with an empty filters string
    };

    // Topic filter
    if (topic) {
        const topicArray = topic.split(",");
        const topics = await TopicModel.find({ Name: { $in: topicArray } });
        const topicIds = topics.map((t) => t._id);
        if (topicIds.length > 0) {
            const topicFilter = topicIds
                .map((id) => `Topic:"${id}"`)
                .join(" OR ");
            algoliaQuery.filters += `(${topicFilter})`;
        }
    }

    // Skill filter
    if (skill) {
        const skillArray = skill.split(",");
        const skills = await SkillModel.find({ Name: { $in: skillArray } });
        const skillIds = skills.map((s) => s._id);
        if (skillIds.length > 0) {
            const skillFilter = skillIds
                .map((id) => `SkillGain:"${id}"`)
                .join(" OR ");
            if (algoliaQuery.filters) algoliaQuery.filters += " AND ";
            algoliaQuery.filters += `(${skillFilter})`;
        }
    }

    // Level filter
    if (level) {
        const levelArray = level.split(",");
        if (levelArray.length > 0) {
            const levelFilter = levelArray
                .map((lvl) => `Level:"${lvl}"`)
                .join(" OR ");
            if (algoliaQuery.filters) {
                algoliaQuery.filters += " AND ";
            }
            algoliaQuery.filters += `(${levelFilter})`;
        }
    }
    // Price filter
    if (price) {
        const [minPrice, maxPrice] = price.split(",").map((p) => parseInt(p));
        const priceFilter = `Price >= ${Math.min(
            minPrice,
            maxPrice
        )} AND Price <= ${Math.max(minPrice, maxPrice)}`;
        if (algoliaQuery.filters) {
            algoliaQuery.filters += " AND ";
        }
        algoliaQuery.filters += priceFilter;
    }

    return algoliaQuery;
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

    const validSortFields = ["Title", "Duration", "Price"];
    let indexName = "multiImage";

    // to lower case sort
    // if (sort && validSortFields.includes(sort)) {
    //     indexName = `course_${sort.toLowerCase()}_${order}`;
    // }

    query.page = Math.max(0, page - 1);
    query.hitsPerPage = ITEMS_PER_PAGE;

    const algoliaResult = await algoliaClient.search({
        requests: [
            {
                indexName: indexName,
                query: query.query || "",
                filters: query.filters || "",
                page: query.page || 0,
                hitsPerPage: query.hitsPerPage || 6,
            },
        ],
    });

    const courses = algoliaResult.results[0].hits;
    console.log(courses[0].Img[0]);
    const totalPages = algoliaResult.results[0].nbPages;

    return {
        courses,
        totalPages,
    };
};

const CourseModel = mongoose.model("Courses", CoursesSchema, "Courses");
module.exports = CourseModel;
