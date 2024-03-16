const BASE_API_URL = "https://api.foursquare.com/v3";
const FOURSQUARE_API_KEY = 'fsq3cXgOhjFwVX0r0E7bNUOGt/eEKbKpC3i4URJqANeIoDQ=';

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

async function getFourSquareData(locationLat, locationLng, nearbySearchTerms) {
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
      Authorization: FOURSQUARE_API_KEY
    } 
  }
  )
  console.log(response.data);
}

async function getFourSquarePhotos(fsqid){
  const response = await axios.get(`${BASE_API_URL}/places/${fsqid}/photos`, {
    headers: {
      Accept: 'application/json',
      Authorisation: API_KEY
    }
  });
  return response.data;
}

async function getCurrentWeatherData(coordinates) {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=9b5dd1595063d41d9f0105cd8a5acbab&units=metric`)
  return response.data;
}

async function getForecastWeatherData(coordinates) {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=9b5dd1595063d41d9f0105cd8a5acbab&units=metric`)
  return response.data;
}


// Calculate distance between two coordinates
function relativeHaversineDistance(aLat, aLng, bLat, bLng) {
  const asin = Math.asin;
  const cos = Math.cos;
  const sin = Math.sin;
  const PI_180 = Math.PI / 180;

  function hav(x) {
    const s = sin(x /2)
    return s * s;
  }

  const aLatRad = aLat * PI_180; // in radian
  const bLatRad = bLat * PI_180;
  const aLngRad = aLng * PI_180;
  const bLngRad = bLng * PI_180;

  const ht = hav(bLatRad - aLatRad)  + cos(aLatRad) * cos(bLatRad) * hav (bLngRad - aLngRad);
  return asin(ht);
}