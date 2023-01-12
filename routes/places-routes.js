const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("Get places in request.");
  res.json({ message: "It works!" });
});

module.exports = router;
