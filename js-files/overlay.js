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
        <h1>${eachLocation.name}</h1><span class="eachLocationGym">gym</span>
        <h3>${eachLocation.address}</h3>
      </div>
      <div>
        <div>
          <a href="${eachLocation.link}" target="_blank"><i class='bx bx-globe'></i></a><span>Website</span>
        </div>
        <div>
          <a><i class='bx bxs-direction-right' ></i></a><span>Direction</span>
        </div> 
      </div>`; 
    } else {
      eachLocationDiv.innerHTML = `
      <div>
        <h1>${eachLocation.name}</h1><span class="eachLocationRoute">route</span>
        <h3>${eachLocation.metadata["parent-sector"]}</h3>
      </div>
      <div>
        <div>
          <a href="${eachLocation.link} target="_blank""><i class='bx bx-globe'></i></a><span>Website</span>
        </div>
        <div>
          <a><i class='bx bxs-direction-right' ></i></a><span>Direction</span>
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

function displayNearbySpots(map, locationName, locationLat, locationLng) {
  document.querySelector("#nearbyContainer").innerHTML = `
  <i class='bx bx-x' onclick="changeSidebar('#resultsContainer')"></i>
  <h1>Find Spots near ${locationName}<h1>
  <div id="nearbySearchButton">
    <a class="nearbyToiletBtn"><i class='bx bx-male-female'></i><p>Toilet</p></a>
    <a class="nearbyRestaurantBtn"><i class='bx bx-restaurant'></i><p>Restaurant</p></a>
    <a class="nearbyAccomodationBtn"><i class='bx bx-hotel'></i><p>Accomodation</p></a>
  <div>
  <div id="nearbySearchContainer">
    <input class="nearbySearchTerm" type="text"/>
    <button class="nearbySearchTermBtn"><i class='bx bx-search-alt-2' ></i></button>
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
  <div id="currentWeatherContainer">
  <i class='bx bx-x' onclick="changeSidebar('#resultsContainer')"></i>
    <div>
      <span>Current Weather @ ${locationName},${currentWeatherData.name}</span>
      <span>${currentTime}</span>
    </div>
    <div>
      <div>
        <img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png"/>
        <div>
          <p>${currentWeatherData.main.temp}&deg;C</p>
          <p>Feels like: ${currentWeatherData.main.feels_like}&degC</p>
        </div>
      </div>
      <p>${capitaliseString(currentWeatherDescription)}</p>
    </div>
  </div>
  <div id="forecastWeatherContainer">
    <p>5-Day Weather Forcast<p>
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
    <div class="dailyForecastLeft">
      <p>${dayOfWeek}</p>
      <p>${dateOfWeek}<p>
    </div>
    <div class="dailyForecastLeftCenter">
      <img src="https://openweathermap.org/img/wn/${forecastWeatherData.list[i].weather[0].icon}@2x.png"/>
      <span>${forecastWeatherData.list[i].main.temp_max}&deg;</span>
      <span>${forecastWeatherData.list[i].main.temp_min}&deg;</span>
    </div>
    <div class="dailyForecastRightCenter">
      <p>${capitaliseString(forecastWeatherDescription)}</p>
    </div>
    <div class="dailyForecastRight">
      <i class='bx bx-droplet'></i><span>${forecastWeatherData.list[i].main.humidity}&percnt;</span>
    </div>
    `
    document.querySelector("#forecastWeatherContainer").appendChild(dailyForecastDiv);
  }
}