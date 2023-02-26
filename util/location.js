require("dotenv").config();
// const API_KEY = process.env.GOOGLE_API_KEY;
const API_KEY = null;

const axios = require("axios");
const HttpError = require("../models/http-error");

async function getCoordsForAddress(address) {
  if (!API_KEY) {
    return {
      lat: 40.75,
      lng: -73.99,
    };
  }

  let response;
  try {
    response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );
  } catch (error) {
    throw error;
  }

  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
