// AXIOS GET FUNCTIONS AND DATA MANUPULATION

// ============================================================================
//                                 ONE MAP API
// ============================================================================
const OM_CREDENTIALS = JSON.stringify({
  "email": "ayoub.e2@xywdining.com",
  "password": "mCGd9w1ipH1!df"
});
const OM_BASE_API_URL = "https://www.onemap.gov.sg"
const OM_AUTH_API = "/api/auth/post/getToken"
const OM_ROUTE_API = "/api/public/routingsvc/route"
const OM_SEARCH_API = "/api/common/elastic/search"
const OM_REVGEOCODE_API = "/api/public/revgeocode"
let OM_ACCESS_TOKEN; //"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaW50ZXJuYWwtYWxiLW9tLXByZGV6aXQtaXQtMTIyMzY5ODk5Mi5hcC1zb3V0aGVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbS9hcGkvdjIvdXNlci9wYXNzd29yZCIsImlhdCI6MTcxMDc1MDcxOCwiZXhwIjoxNzExMDA5OTE4LCJuYmYiOjE3MTA3NTA3MTgsImp0aSI6IndHaUU4YTJUYmk4WERCYjIiLCJzdWIiOiI4N2Y2MDBhYzkwMGM5MjcxN2Q3ZWVlMWFhY2U4ZTI5NCIsInVzZXJfaWQiOjI5NTYsImZvcmV2ZXIiOmZhbHNlfQ.a1attX2FXTO1IXcJp_6_WdIQooQ2sObEjk3co4aZAjU"
let OM_HEADER;

/**
 * Loads OneMap API to get the current access token and assign it to the header for authorisation
 */
async function getOMAuthorization() {
  OM_ACCESS_TOKEN = await getOMAccessToken();
  OM_HEADER = {
    Authorization: `${OM_ACCESS_TOKEN}`
  }
}

/**
 * Calls OneMap API to get the current access token
 * @returns Current access token
 */
async function getOMAccessToken() {
  try {
    let response = await axios.post(`${OM_BASE_API_URL + OM_AUTH_API}`,OM_CREDENTIALS, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Get travel path for walking, driving or cycling (WDC)
 * @param {*} start Coordinates of start location (lat, lng)
 * @param {*} end Coordinates of end location (lat, lng)
 * @param {*} routeType Route types - walking, driving or cycling (in lowercase)
 * @returns Route information object
 */
async function getOMRouteWDC(start, end, routeType) {
  console.log("start", start);
  console.log("end", end);

  try {
    let response = await axios.get(`${OM_BASE_API_URL}${OM_ROUTE_API}`, {
      headers: OM_HEADER,
      params: {
        start: start[0] + "," + start[1],
        end: end[0] + "," + end[1],
        routeType: routeType,
      }
    });
    return response.data;
  } 
  catch (error) {
    console.log(error.message)
  }
}


// /**
//  * Get travel path for public transport
//  * @param {*} start Coordinates of start location (lat, lng)
//  * @param {*} end Coordinates of end location (lat, lng)
//  *  @returns Route information object
//  */
// async function getOMRoutePT(start, end) {
//   try {
//     let currentDate = new Date();
//     let currentDateString = currentDate.toLocaleDateString();
//     let currentTimeString = currentDate.toTimeString();
//     let date = currentDateString.split("/").join("-");
//     if (currentDateString[0] != 0) {
//       date = '0' + date;
//     };

//     let response = await axios.get(`${OM_BASE_API_URL}${OM_ROUTE_API}`, {
//       headers: OM_HEADER,
//       params: {
//         start: start[0] + "," + start[1],
//         end: end[1] + "," + end[0],
//         routeType: 'pt',
//         date: date,
//         time: currentTimeString.split(" ")[0],
//         mode: 'TRANSIT',
//         maxWalkDistance: 1000,
//         numItineraries: 3
//       }
//     });
//     return response.data;
//   } 
//   catch (error) {
//     console.log(error.message)
//   }
// }

/**
 * Enables users to obtain address information based on search term
 * @param {*} searchVal Keyword entered by users to filter search results
 * @returns Object containing search results
 */
async function getOMSearch(searchVal) {
  try {
    let response = await axios.get(`${OM_BASE_API_URL}${OM_SEARCH_API}`, {
      headers: OM_HEADER,
      params: {
        searchVal: searchVal,
        returnGeom: 'Y',
        getAddrDetails: 'Y',
        pageNum: 1
      }
    });
    return response.data;
  } 
  catch (error) {
    console.log(error.message)
  }
}

/**
 * Enables users to obtain address information based on search term
 * @param {*} searchVal Keyword entered by users to filter search results
 * @returns Object containing search results
 */
async function getOMRevGeocode(lat, lng) {
  try {
    let response = await axios.get(`${OM_BASE_API_URL}${OM_REVGEOCODE_API}`, {
      headers: OM_HEADER,
      params: {
        location: `${lat + ',' + lng}`,
        buffer: 40,
        addressType: 'All',
        otherFeatures: 'Y'
      },
    });
    return response.data;
  } 
  catch (error) {
    console.log(error.message)
  }
}

// ============================================================================
//                                 FOURSQUARE API
// ============================================================================
const FSQ_BASE_API_URL = "https://api.foursquare.com/v3";
const FSQ_API_KEY = 'fsq32re8uvt4gru84t8jz7gpYJ/PikEcEJmZnlYYKH75Zuc=';

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

async function getFourSquareData(locationLat, locationLng, searchTerms) {
  const response = await axios.get(`${FSQ_BASE_API_URL}/places/search`, {
    params: {
      query: encodeURI(searchTerms),
      ll: locationLat + "," + locationLng,
      sort: "DISTANCE",
      radius: 1000,
      limit: 50
    }, 
    headers: {
      accept: 'application/json',
      Authorization: FSQ_API_KEY
    }
  })

  return response.data;
}

async function getFourSquarePhotos(fsqid) {
  try {
      const response = await axios.get(`${FSQ_BASE_API_URL}/places/${fsqid}/photos`, {
        headers: {
            Accept: "application/json",
            Authorization: FSQ_API_KEY
        }
    });
    return response.data;
  } catch (error) {
    return "not found";
  }
}

// ============================================================================
//                                 OPENWEATHER API
// ============================================================================
async function getCurrentWeatherData(coordinates) {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=9b5dd1595063d41d9f0105cd8a5acbab&units=metric`)
  return response.data;
}

async function getForecastWeatherData(coordinates) {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=9b5dd1595063d41d9f0105cd8a5acbab&units=metric`)
  return response.data;
}

async function getOneMapRoutingData(USER_COORDINATES) {
  const response = await axios.get(`https://www.onemap.gov.sg/api/public/routingsvc/route`);
  return response.data;
}

// ============================================================================
//                           OTHER DATA MANIPULATION
// ============================================================================
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

// Capitalise a string
function capitaliseString(string) {
  const spacedString = string.split("-").join(" ");
  const splitString = spacedString.split(" ").map((eachString)=>{
    return eachString.charAt(0).toUpperCase() + eachString.slice(1);
  })
  const capitalisedString = splitString.join(" ");
  
  return capitalisedString;
}


// Generate random integer
function getRandomInt(maxInt) {
  return Math.floor(Math.random() * maxInt);
}