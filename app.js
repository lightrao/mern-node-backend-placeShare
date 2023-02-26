const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const port = 5000;
const dbName = "mern";

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// fix CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // which domain can access the backend
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // allow which header come with request can access the backend
  // allow which method from front end can access the backend
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// outsource routes into separate files
app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route!", 404);
  throw error;
});

// error handling middleware function
// this function will only be executed on the requests that have an error attached to it
app.use((error, req, res, next) => {
  // multer add file property to req object
  if (req.file) {
    fs.unlink(req.file.path, (err) => console.log(err));
  }
  // check if a response has already been sent
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ssgnute.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Places Share App is listening on port ${port}...`);
    });
  })
  .catch((err) => console.log(err));
