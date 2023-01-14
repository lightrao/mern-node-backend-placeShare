class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a "message" property to the object
    this.code = errorCode; // adds a code property to instances based on this class
  }
}

module.exports = HttpError;
