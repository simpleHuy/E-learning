const mongoose = require("mongoose");

const uri =
  "mongodb+srv://miketsu:ArQeYpRxPn1sakoc@thienchi.iwqdc.mongodb.net/";

async function connect() {
  try {
    await mongoose.connect(uri, {});
    console.log("Connect successfully!!!");
  } catch (error) {
    console.log("Connect failure!!!");
  }
}
module.exports = { connect };
