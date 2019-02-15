const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
var cors = require("cors");



const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();


const dbRoute = "mongodb://admin:admin@cluster0-shard-00-00-4gsxn.mongodb.net:27017,cluster0-shard-00-01-4gsxn.mongodb.net:27017,cluster0-shard-00-02-4gsxn.mongodb.net:27017/Data1?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

// backend to db
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is  get method
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is update method
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is  delete method
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is create method
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message, firstName, lastName, address, username, password, zipCode } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.firstName = firstName;
  data.lastName = lastName;
  data.address = address;
  data.username = username;
  data.password = password;
  data.zipCode = zipCode;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));