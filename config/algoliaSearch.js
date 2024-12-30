const { searchClient } = require('algoliasearch');
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const client = searchClient(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

module.exports = client;