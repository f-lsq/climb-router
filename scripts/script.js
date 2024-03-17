// MAIN SCRIPT THAT CALLS FUNCTIONS FROM OTHER SCRIPTS

let USER_COORDINATES = [1.3548, 103.7763];
getLocation();

let markerAll = [];

document.addEventListener('DOMContentLoaded', async function(){
  const locationData = await getLocationData();
  const countryData = await getCountryData();
  
  // Generate Random Location Suggestion in Home Page
  // generateLocationSuggestion(locationData);

  // Create Leaflet Map
  const mapItems = createMap('map', USER_COORDINATES);
  map = mapItems.map;
  createUserMarker (map, USER_COORDINATES)
  createMapSelect(countryData, map);

  // Displays all location
  displayAllLocation(locationData, "climbing-all");
  const locationTypeSelect = document.querySelector("#locationTypeSelect");
  locationTypeSelect.addEventListener("change", function(){
    displayAllLocation(locationData, locationTypeSelect.value);
  });

  // Create Markers and Layer Controls
  createLayerControl(locationData, map, mapItems.defaultMapTile)
  searchLocation(locationData);
  document.querySelector('#currLocationBtn').addEventListener('click', ()=>{
    map.flyTo(USER_COORDINATES, 13);
  })

  // Display Location Information when a Result is Clicked
  for (let eachLocationDiv of document.querySelectorAll(".eachLocationResult")) {
    eachLocationDiv.addEventListener("click", function(){
      displayClickedLocation(map, eachLocationDiv.id);
    })
  }

  for (let eachMarker of markerAll) {
    eachMarker.addEventListener("click", async function(){
      markerLatLng = eachMarker.getLatLng();
      // const currentWeatherData = await getCurrentWeatherData([markerLatLng.lat, markerLatLng.lng]);
      // const forecastWeatherData = await getForecastWeatherData([markerLatLng.lat, markerLatLng.lng]);
      let locationName = ""
      for (let i = 0; i < locationData.length; i++) {
        const gymLocation = locationData[i]["climbing-gyms"];
        const routeLocation = locationData[i]["climbing-routes"];
        if (i==0){
          for (let eachGym of gymLocation) {
            if (eachGym.metadata["mp-location-id"] == eachMarker.options.title) {
              locationName = eachGym.name;
            }
          }
        } else {
          for (let eachRoute of routeLocation) {
            if (eachRoute.metadata["mp-location-id"] == eachMarker.options.title) {
              locationName = eachRoute.name;
            }
          }
        }

      }

    
      displayNearbySpots(map, locationName, markerLatLng.lat, markerLatLng.lng);
      // displayLocationWeather(locationName, currentWeatherData, forecastWeatherData)
    })
  }



  // L.Routing.control({
  //   waypoints: [
  //     L.latLng(1.3548, 103.7763),
  //     L.latLng(1.4145840167232775, 103.8311410511582)
  //   ]
  // }).addTo(map);

  
  
  
})  
