// LEAFLET MAP OVERLAYS JAVASCRIPT

function createMapSelect(countryData, map) {
  const countrySelect = document.querySelector('#mapCountry');
  const stateSelect = document.querySelector('#mapState');
  
  createCountrySelect(countryData);
  createStateSelect(countryData, countrySelect.value)
  countrySelect.addEventListener('change', function(){
    createStateSelect(countryData, countrySelect.value);
  })
  stateSelect.addEventListener('change', function() {
    let selectedCountry = selectedState = null;
    for (let eachCountry of countryData) {
      if (eachCountry.iso3 == countrySelect.value) {
        selectedCountry = eachCountry;
        break;
      } 
    }
    for (let eachState of selectedCountry.states) {
      if (eachState.state_code == stateSelect.value) {
        selectedState = eachState;
        break;
      }
    }
    map.flyTo([selectedState.latitude, selectedState.longitude])
  });
}

function createCountrySelect(countryData) {
  countrySelect = document.querySelector('#mapCountry');
  for (let eachCountry of countryData) {
    countryOption = document.createElement('option')
    countryOption.setAttribute('value', eachCountry.iso3)
    if (eachCountry.iso3 == "SGP") {
      countryOption.setAttribute('selected', 'selected')
    }
    countryOption.innerHTML = eachCountry.name;
    countrySelect.appendChild(countryOption);
  }
}

function createStateSelect(countryData, countryISO3) {
  const stateSelect = document.querySelector('#mapState');
  stateSelect.innerHTML = '';
  let selectedCountry = {};
  for (let eachCountry of countryData) {
    if (eachCountry.iso3 == countryISO3) {
      selectedCountry = eachCountry;
      break;
    }
  }
  for (let eachState of selectedCountry.states) {
    stateOption = document.createElement('option')
    stateOption.setAttribute('value', eachState.state_code)
    stateOption.innerHTML = eachState.name
    stateSelect.appendChild(stateOption);
  }
}

function displayAllLocation(locationData, selectedType) {
  const locationDiv = document.querySelector("#locationContainer");
  locationDiv.innerHTML = "";
  let allLocation = locationData[0]["climbing-gyms"].concat(locationData[1]["climbing-routes"]);
  if (selectedType == "climbing-gyms") {
    allLocation = locationData[0]["climbing-gyms"];
  } else if (selectedType == "climbing-routes") {
    allLocation = locationData[1]["climbing-routes"]
  }

  // Sort by distance from user
  const allLocationSorted = allLocation.sort((a,b) => {
    return relativeHaversineDistance(a.metadata["parent-lnglat"][1], a.metadata["parent-lnglat"][0], USER_COORDINATES[0], USER_COORDINATES[1])
    - relativeHaversineDistance(b.metadata["parent-lnglat"][1], b.metadata["parent-lnglat"][0], USER_COORDINATES[0], USER_COORDINATES[1])
  });

  for (let eachLocation of allLocationSorted) {
    const eachLocationDiv = document.createElement("div");
    eachLocationDiv.setAttribute("id",eachLocation.metadata["mp-location-id"]);
    eachLocationDiv.classList.add("eachLocationResult")

    if (locationData[0]["climbing-gyms"].includes(eachLocation)) {
      eachLocationDiv.innerHTML = `
      <div>
        <div class="eachLocationTitle">
          <h1>${eachLocation.name}</h1><span class="eachLocationGym">gym</span>
        </div>
      </div>
      <div class="eachLocationContent">
        <h3>${eachLocation.address}</h3>
        <div class="eachLocationBtn">
          <div>
            <a class="eachLocationWebsite" href="${eachLocation.link}" target="_blank"><i class='bx bx-globe'></i></a><span>Website</span>
          </div>
          <div>
            <a class="eachLocationDirection" onclick="changeSidebar('#directionContainer')"><i class='bx bxs-direction-right'></i></a><span>Direction</span>
          </div> 
        </div>
      </div>`; 
    } else {
      eachLocationDiv.innerHTML = `
      <div>
        <div class="eachLocationTitle">
          <h1>${eachLocation.name}</h1><span class="eachLocationRoute">route</span>
        </div>
      </div>
      <div class="eachLocationContent">
        <h3>${eachLocation.metadata["parent-sector"]}</h3>
        <div class="eachLocationBtn">
          <div>
            <a class="eachLocationWebsite" href="${eachLocation.link}" target="_blank"><i class='bx bx-globe'></i></a><span>Website</span>
          </div>
          <div>
            <a class="eachLocationDirection" onclick="changeSidebar('#directionContainer')"><i class='bx bxs-direction-right'></i></a><span>Direction</span>
          </div> 
        </div>

      </div>`;
    }
    locationDiv.appendChild(eachLocationDiv);   
  }
}

function displayClickedLocation(map, locationId){
  map.closePopup();
  for (let eachMarker in markerAll) {
    if (locationId == markerAll[eachMarker].options.title) {
      markerCoordinates = markerAll[eachMarker].getLatLng();
      console.log(markerCoordinates);
      map.flyTo([markerCoordinates.lat+0.002,markerCoordinates.lng], 17);
      map.on("zoomend", ()=>{
        markerAll[eachMarker].openPopup();
      })
    }
  }
}

function changeSidebar(eachSideBarDivId) {
  const sideBarDiv = document.querySelectorAll(".mapSideBar");
  for (let eachSideBarDiv of sideBarDiv) {
    eachSideBarDiv.classList.remove("active");
  }
  document.querySelector(eachSideBarDivId).classList.add("active");
}

async function displayDirections(directionLayer, locationName, locationLat, locationLng) {
  directionLayer.clearLayers();

  document.querySelector("#directionContainer").innerHTML = `
  <button class="closeSidebarBtn" onclick="changeSidebar('#resultsContainer')">
    <i class='bx bx-x'></i>
  </button>
  <div id="directionTitle">
    <div id="directionModeBtn">
      <a id="directionDriveBtn" class="selected"><i class='bx bx-car'></i><span>Drive</span></a>
      <a id="directionWalkBtn"><i class='bx bx-walk'></i><span>Walk</span></a>
      <a id="directionCycleBtn"><i class='bx bx-cycling'></i><span>Cycle</span></a>
    </div>
    <div id="directionInput">
      <label><i class='bx bx-radio-circle-marked' ></i></label><input class="directionStartInput" type="text" readonly/>
      <label><i class='bx bx-map' ></i></label><input class="directionEndInput" type="text" readonly/>
    </div>
  </div>
  <div id="directionResults">
  </div>
  `
  const userAddress = await getOMRevGeocode(USER_COORDINATES[0], USER_COORDINATES[1]);
  const destAddress = await getOMRevGeocode(locationLat, locationLng);

  const userAddressFirst = userAddress.GeocodeInfo[0] // first address in user address geocode array
  const destAddressFirst = destAddress.GeocodeInfo[0] // first address in destination address geocode array

  let userAddressInfo = [userAddressFirst.BUILDINGNAME, userAddressFirst.BLOCK, userAddressFirst.ROAD, userAddressFirst.POSTALCODE]
  let destAddressInfo = [locationName, destAddressFirst.BLOCK, destAddressFirst.ROAD, destAddressFirst.POSTALCODE]
  userAddressInfo = userAddressInfo.map((each) => {
    return capitaliseString(each);
  });
  destAddressInfo = destAddressInfo.map((each) => {
    return capitaliseString(each);
  });

  const directionStartInput = document.querySelector(".directionStartInput");
  const directionEndInput = document.querySelector(".directionEndInput");

  directionStartInput.value = `${userAddressInfo[0]}, ${userAddressInfo[1]} ${userAddressInfo[2]}, ${userAddressInfo[3]}`;
  directionEndInput.value = `${destAddressInfo[0]}, ${destAddressInfo[1]} ${destAddressInfo[2]}, ${destAddressInfo[3]}`;

  let userStartInput = await getOMSearch(directionStartInput.value);
  let userEndInput = await getOMSearch(directionEndInput.value);

  let userStartCoordinates = USER_COORDINATES;
  let userEndCoordinates = [locationLat,locationLng];

  // validation for user input
  if (userStartInput.found) {
    userStartCoordinates = [userStartInput.results[0].LATITUDE, userStartInput.results[0].LONGITUDE];
  }
  if (userEndInput.found) {
    userEndCoordinates = [userEndInput.results[0].LATITUDE, userEndInput.results[0].LONGITUDE];
  }

  const directionDriveBtn = document.querySelector("#directionDriveBtn");
  const directionWalkBtn = document.querySelector("#directionWalkBtn");
  const directionCycleBtn = document.querySelector("#directionCycleBtn");

  // Event listener for 'Drive' button
  directionDriveBtn.addEventListener("click", async function(){
    directionDriveBtn.classList.remove("selected");
    directionWalkBtn.classList.remove("selected");
    directionCycleBtn.classList.remove("selected");
    directionDriveBtn.classList.add("selected");

    const routeData = await getOMRouteWDC(userStartCoordinates, userEndCoordinates, "drive");
    addRouteToMap(routeData, directionLayer);
    getDirectionResults(routeData);
  });

  // Event listener for 'Walk' button
  directionWalkBtn.addEventListener("click", async function(){
    directionDriveBtn.classList.remove("selected");
    directionWalkBtn.classList.remove("selected");
    directionCycleBtn.classList.remove("selected");
    directionWalkBtn.classList.add("selected");

    const routeData = await getOMRouteWDC(userStartCoordinates, userEndCoordinates, "walk");
    addRouteToMap(routeData, directionLayer);
    getDirectionResults(routeData);
  });

  // Event listener for 'Cycle' button
  directionCycleBtn.addEventListener("click", async function(){
    directionDriveBtn.classList.remove("selected");
    directionWalkBtn.classList.remove("selected");
    directionCycleBtn.classList.remove("selected");
    directionCycleBtn.classList.add("selected");

    const routeData = await getOMRouteWDC(userStartCoordinates, userEndCoordinates, "cycle");
    addRouteToMap(routeData, directionLayer);
    getDirectionResults(routeData);
  });
  
  // Default to showing 'Drive' information
  directionDriveBtn.click();

  


}

function displayNearbySpots(map, locationName, locationLat, locationLng) {
  document.querySelector("#nearbyContainer").innerHTML = `
  <button class="closeSidebarBtn" onclick="changeSidebar('#resultsContainer')">
    <i class='bx bx-x'></i>
  </button>
  <div id="nearbySearchTitle">
    <h1>Find Spots near ${locationName}<h1>
    <div id="nearbySearchButton">
      <a class="nearbyToiletBtn"><i class='bx bx-male-female'></i><span>Toilet</span></a>
      <a class="nearbyRestaurantBtn"><i class='bx bx-restaurant'></i><span>Restaurant</span></a>
      <a class="nearbyAccomodationBtn"><i class='bx bx-hotel'></i><span>Accomodation</span></a>
    </div>
    <div id="nearbySearchContainer">
      <input class="nearbySearchTerm" type="text" placeholder="Search other spots..."/>
      <button class="nearbySearchTermBtn"><i class='bx bx-search-alt-2' ></i></button>
    </div>
  </div>
  <div id="nearbySearchResults">
  </div>
  `
  const nearbySpotLayer = L.markerClusterGroup();
  nearbySpotLayer.addTo(map);
  document.querySelector(".nearbyToiletBtn").addEventListener("click", async function(){
    createNearbyMarkers(map, nearbySpotLayer, "toilet", locationLat, locationLng);
  });

  document.querySelector(".nearbyRestaurantBtn").addEventListener("click", function(){
    createNearbyMarkers(map, nearbySpotLayer, "restaurant", locationLat, locationLng);
  });

  document.querySelector(".nearbyAccomodationBtn").addEventListener("click", function(){
    createNearbyMarkers(map, nearbySpotLayer, "hotel", locationLat, locationLng);
  });

  const nearbySearchTermInput = document.querySelector(".nearbySearchTerm");
  const nearbySearchTermBtn = document.querySelector(".nearbySearchTermBtn");
  nearbySearchTermBtn.addEventListener("click", function(){
    const nearbySearchTerm = nearbySearchTermInput.value;
    if (nearbySearchTerm) {
      createNearbyMarkers(map, nearbySpotLayer, nearbySearchTerm, locationLat, locationLng);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a valid search term!",
        confirmButtonColor: "#f58831",
      });
    }
  });

  nearbySearchTermInput.addEventListener("keypress",function(event){
    if (event.key === "Enter") {
      // Prevents form submission
      event.preventDefault();
      nearbySearchTermBtn.click();
    }
  })
  
}

function changeNearbyPopup(eachNearbyDivClass) {
  const nearbyPopupDiv = document.querySelectorAll(".eachPopupContentInfo div");
  for (let eachNearbyPopupDiv of nearbyPopupDiv) {
    eachNearbyPopupDiv.classList.remove("active");
  }
  document.querySelector(eachNearbyDivClass).classList.add("active");
}

function displayLocationWeather(locationName, currentWeatherData, forecastWeatherData) {
  let currentTime = new Date().toLocaleTimeString([], {
    "hour": "2-digit", 
    "minute": "2-digit"
  });
  let currentWeatherDescription = currentWeatherData.weather[0].description;
  document.querySelector("#weatherContainer").innerHTML = `
  <button class="closeSidebarBtn" onclick="changeSidebar('#resultsContainer')">
    <i class='bx bx-x'></i>
  </button>
  <div id="currentWeatherContainer">
    <div id="currentWeatherTitle">
      <div>
        <span>CURRENT WEATHER</span>
        <span>${currentTime}</span>
      </div>
      <p>@ ${locationName},${currentWeatherData.name}</p>
    </div>
    <div id="currentWeatherContent">
      <div id="currentWeatherDiv">
        <img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png"/>
        <div>
          <p id="currentWeatherTemp">${currentWeatherData.main.temp}&deg;C</p>
          <p id="currentWeatherFeels">Feels like ${currentWeatherData.main.feels_like}&degC</p>
        </div>
      </div>
      <p id="currentWeatherDesc">${capitaliseString(currentWeatherDescription)}</p>
    </div>
  </div>
  <div id="forecastWeatherContainer">
    <p id="forecastWeatherTitle">5-DAY FORECAST WEATHER<p>
  </div>
  `
  for (let i = 0; i < forecastWeatherData.list.length; i += 8) {
    const dateDate = new Date(forecastWeatherData.list[i].dt_txt);
    const dateString = dateDate.toString();
    let dayOfWeek = "TODAY"
    if (i != 0) {
      dayOfWeek = dateString.slice(0, 4).toUpperCase();
    } 
    let dateOfWeek = dateString.slice(4, 10);

    let forecastWeatherDescription = forecastWeatherData.list[i].weather[0].description;
    
    
    dailyForecastDiv = document.createElement("div");
    dailyForecastDiv.innerHTML = `
    <div id="forecastWeatherContent">
      <div id="dailyForecastLeft">
        <p id="dailyForecastDay">${dayOfWeek}</p>
        <p id="dailyForecastDate">${dateOfWeek}<p>
      </div>
      <div id="dailyForecastLeftCenter">
        <img src="https://openweathermap.org/img/wn/${forecastWeatherData.list[i].weather[0].icon}@2x.png"/>
        <span id="dailyForecastMax">${forecastWeatherData.list[i].main.temp_max}&deg;</span>
        <span id="dailyForecastMin">${forecastWeatherData.list[i].main.temp_min}&deg;</span>
      </div>
      <div id="dailyForecastRightCenter">
        <p>${capitaliseString(forecastWeatherDescription)}</p>
      </div>
      <div id="dailyForecastRight">
        <i class='bx bx-droplet'></i><span>${forecastWeatherData.list[i].main.humidity}&percnt;</span>
      </div>
    </div>

    `
    document.querySelector("#forecastWeatherContainer").appendChild(dailyForecastDiv);
  }
}

async function getDirectionResults(routeData){
  const directionResultsDiv = document.querySelector("#directionResults");

  directionResultsDiv.innerHTML = ""
  for (let eachRouteInstruction of routeData.route_instructions) {
    const eachRouteInstructionDiv = document.createElement("div");
    eachRouteInstructionDiv.classList.add("eachDirectionResult");

    // Convert travel distance to m, km (whichever unit is most approperiate)
    let travelDist = eachRouteInstruction[2]; // in meters
    let travelDistString = `${travelDist.toString()} m`
    if (travelDist >= 1000) {
      travelDist = travelDist/1000; // convert to kilometers
      travelDistString = `${travelDist.toFixed(1).toString()} km`;
    }

    // Convert travel time to sec, min, hr (whichever unit is most approperiate)
    let travelTime = eachRouteInstruction[4]; // in seconds
    let travelTimeString = `${travelTime.toString()} sec`
    if (travelTime >= 60 * 60) {
      travelTime = travelTime / (60 * 60) // convert to hours
      let travelTimeMin = travelTime % 1 * 60// get minutes portion
      travelTimeString = `${travelTime.toFixed().toString()} hr ${travelTimeMin.toFixed().toString()} min`;
    } else if (travelTime >= 60) {
      travelTime = travelTime / 60 // convert to minutes
      travelTimeString = `${travelTime.toFixed().toString()} min`;
    }
    
    eachRouteInstructionDiv.innerHTML = `
    <div class="eachDirectionResultImg">
      <img src="assets/${kebabString(eachRouteInstruction[0])}.webp">
    </div>
    <div class="eachDirectionResultContent">
      <p>${eachRouteInstruction[9]}</p>
      <p>${travelTimeString} (${travelDistString})</p>
      <p>${eachRouteInstruction[4]} (${eachRouteInstruction[2]})</p>
    </div>
    `
    directionResultsDiv.appendChild(eachRouteInstructionDiv);
  }
}

function changeMapView() {
  document.querySelector("#resultsContainer").classList.toggle('map-active');
  document.querySelector("#mapContainer").classList.toggle('map-active');
  document.querySelector("#viewMapBtn").classList.toggle('map-active');
  document.querySelector("#exitMapBtn").classList.toggle('map-active');
}

