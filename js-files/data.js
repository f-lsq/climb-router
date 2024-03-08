const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = 'fsq3cXgOhjFwVX0r0E7bNUOGt/eEKbKpC3i4URJqANeIoDQ=';

/**
 * Get route and gym information from 'location.json'
 * @returns Array of routes and gyms in each country
 */
async function getLocationData() {
  const response = await axios.get("json-files/location.json");
  return response.data;
}

/**
 * Get country and states information from 'countries.json'
 * @returns Array of country information
 */
async function getCountryData() {
  const response = await axios.get("json-files/countries.json");
  return response.data;
}

async function search(lat, lng, searchTerms) {
  const response = await axios.get(`${BASE_API_URL}/places/search`, {
    params: {
      query: encodeURI(searchTerms), //encodeURI function to convert special characters to their encoded equivalent
      ll: lat + "," + lng,
      // categories: '13033', // enable use of categories
      sort: 'DISTANCE',
      radius: 2000,
      limit: 50
    },
    headers: {
      Accept: 'application/json',
      Authorization: API_KEY
    } 
  }
  )
  return response.data;
}

async function getPhotoFromFourSquare(fsqid){
  const response = await axios.get(`${BASE_API_URL}/places/${fsqid}/photos`, {
    headers: {
      Accept: 'application/json',
      Authorisation: API_KEY
    }
  });
  return response.data;
}