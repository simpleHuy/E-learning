const algoliasearch = require("algoliasearch");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
);

const index = client.initIndex("course");

module.exports = index;
