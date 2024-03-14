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
      map.flyTo(markerAll[eachMarker].getLatLng(), 17);
      map.on("zoomend", ()=>{
        markerAll[eachMarker].openPopup();
      })
    }
  }
}