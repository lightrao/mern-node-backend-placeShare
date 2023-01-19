require("dotenv").config();
const API_KEY = process.env.GOOGLE_API_KEY || null;

const axios = require("axios");
const HttpError = require("./models/http-error");

async function getCoordsForAddress(address) {
  const api_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${API_KEY}`;
  console.log("api_url:", api_url);

  let response;
  try {
    response = await axios.get(api_url);
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

async function helpFunc() {
  const result = await getCoordsForAddress("11 Wall St, New York, NY 10005");
  console.log("Coordinates is:", result);
}

helpFunc();
// module.exports = getCoordsForAddress;
