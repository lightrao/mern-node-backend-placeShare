const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const port = 5000;
const dbName = "placesDB";

const app = express();

app.use(bodyParser.json());

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
  // check if a response has already been sent
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ssgnute.mongodb.net/${dbName}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Places Share App is listening on port ${port}...`);
    });
  })
  .catch((err) => console.log(err));
