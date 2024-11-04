const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const uri = process.env.MONGODB_URI;
async function connect() {
  try {
    await mongoose.connect(uri, {});
    console.log("Connect successfully!!!");
  } catch (error) {
    console.log("Connect failure!!!", error.message);
  }
}
module.exports = { connect };
