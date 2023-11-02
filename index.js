const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authroutes.js");

const app = express();
app.use(express.json());

var bodyParser = require("body-parser");

const cors = require("cors");

//var AdminRoutes = require("./Routes/Adminroutes.js");
var mongodb = require("./config/mongoconfig.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const mongo = mongoose.connect(mongodb.url);
mongo.then(
  () => {
    console.log("Mongo_DB Connected Successfully");
  },
  (error) => {
    console.log(
      error,
      "Error, While connecting to Mongo_DB somthing went wrong"
    );
  }
);

var port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});

app.get("/", (req, res) => res.send("forgot password method"));

//app.use("/api", AdminRoutes);
app.use("/auth", authRoutes);

module.exports = app;
