/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./views/**/*.hbs",
        "./public/**/*.js",
        "./public/**/*.html",
        "./views/*.hbs",
    ],
    theme: {
        extend: {
            maxWidth: {
                "8xl": "88rem",
            },
        },
    },
    plugins: [],
};
