const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

// outsource routes into separate files
app.use("/api/places", placesRoutes); // => /api/places/...

app.listen(5000);
