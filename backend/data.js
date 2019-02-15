
// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//data base's data structure 
const DataSchema = new Schema(
  {
    id: Number,
    message: String,
    address: String,
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    zipCode: String
  },
  { timestamps: true }
);

// export the new Schema
module.exports = mongoose.model("Data", DataSchema);