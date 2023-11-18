const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl)
  .then(function () {
    console.log("database connected!");
  })
  .catch(function (err) {
    console.log(err);
  });

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server started on port", port);
});