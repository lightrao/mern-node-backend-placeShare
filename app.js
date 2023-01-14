const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

// outsource routes into separate files
app.use("/api/places", placesRoutes); // => /api/places/...

// error handling middleware function
// this function will only be executed on the requests that have an error attached to it
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
