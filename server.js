const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl)
  .then(function () {
    console.log("database connected!");
  })
  .catch(function (err) {
    console.log(err);
  });

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server started on port", port);
});