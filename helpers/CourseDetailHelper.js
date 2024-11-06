const hbs = require("hbs");

hbs.registerHelper("calcNumberOfModules", function (Course) {
    return Course.Modules.length;
});

hbs.registerHelper("calcTotalVideoTime", function (Course) {
    return Math.floor(Course.calcTotalTime() / 60);
});

hbs.registerHelper("ConvertMinutesToHours", function (value) {
    return (value / 60).toFixed(1);
});

hbs.registerHelper("increment", function (value) {
    return value + 1;
});
