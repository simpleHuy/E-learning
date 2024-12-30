const hbs = require("hbs");

hbs.registerHelper("calcNumberOfModules", function (Course) {
    return Course.Modules.length;
});

// calc all lessons duration
hbs.registerHelper("calcTotalVideoTime", function (Course) {
    const totalTime =  Course.Modules.reduce((acc, module) => {
        return (
            acc +
            module.Lessons.reduce((acc, lesson) => {
                return acc + lesson.Duration;
            }, 0)
        );
    }, 0);

    return Math.floor(totalTime / 60);
});

hbs.registerHelper("calcModulesTime", function (Module) {
    const totalTime = Module.Lessons.reduce((acc, lesson) => {
        return acc + lesson.Duration;
    }, 0);
    return (totalTime / 60).toFixed(1);
});

hbs.registerHelper("increment", function (value) {
    return value + 1;
});

hbs.registerHelper("ConvertLevelToDesc", function (level) {
    if (level === "Beginner") return "No prior experience required";

    if (level === "Intermediate") return "Prior experience recommended";

    if (level === "Advanced") return "Expert level";
});

hbs.registerHelper("lt", function (v1, v2, options) {
    if (v1 < v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper("calculateDiscount", (price, sale) => {
    const discountedPrice = (price * sale) / 100;
    return discountedPrice.toFixed(0); // Làm tròn số
});
hbs.registerHelper("isEmpty", function (array, options) {
    return array && array.length === 0
        ? options.fn(this)
        : options.inverse(this);
});

hbs.registerHelper("getThumbnail", function (imgs) {
    return imgs[0];
});