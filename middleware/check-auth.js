const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: "Bearer TOKEN"

    if (!token) {
      const error = new HttpError(
        "Your have no token, can't be authenticated!",
        401
      );
      return next(error);
    }

    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "The headers not include authorization part OR token invalid, authentication failed!",
      401
    );
    return next(error);
  }
};
