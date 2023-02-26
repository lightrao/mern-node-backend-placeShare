const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: "Bearer TOKEN"

    if (!token) {
      const error = new HttpError(
        "Your have no token, can't be authenticated!",
        403
      );
      return next(error);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "The headers not include authorization part OR token invalid, authentication failed!",
      403
    );
    return next(error);
  }
};
