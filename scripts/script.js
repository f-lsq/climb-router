// MAIN SCRIPT THAT CALLS FUNCTIONS FROM OTHER SCRIPTS

let USER_COORDINATES = [1.3548, 103.7763];
let markerAll = [];
getLocation();

document.addEventListener('DOMContentLoaded', async function(){
  await loading();

  const locationData = await getLocationData();
  const countryData = await getCountryData();

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

  // Create a layer group for directions
  const directionLayer = L.layerGroup(); 
  const nearbyLayer = L.layerGroup(); 
  directionLayer.addTo(map)
  nearbyLayer.addTo(map)
  
  // Get API information for each marker
  for (let eachMarker of markerAll) {
    eachMarker.addEventListener("click", async function(){
      directionLayer.clearLayers();
      nearbyLayer.clearLayers();
      markerLatLng = eachMarker.getLatLng();
      const currentWeatherData = await getCurrentWeatherData([markerLatLng.lat, markerLatLng.lng]);
      const forecastWeatherData = await getForecastWeatherData([markerLatLng.lat, markerLatLng.lng]);
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

      await displayDirections(directionLayer, locationName, markerLatLng.lat, markerLatLng.lng);
      displayNearbySpots(map, nearbyLayer, locationName, markerLatLng.lat, markerLatLng.lng);
      displayLocationWeather(locationName, currentWeatherData, forecastWeatherData);

      const closeSideBtn = document.querySelectorAll(".closeSidebarBtn");
      closeSideBtn.forEach((eachCloseSideBtn) => {
        eachCloseSideBtn.onclick = () => {
          changeSidebar('#resultsContainer');
          directionLayer.clearLayers();
          nearbyLayer.clearLayers();
          document.querySelector("#mapContainer").classList.remove("active");
          document.querySelector("#viewMapBtn").classList.remove('map-active');
          document.querySelector("#exitMapBtn").classList.remove('map-active');
          document.querySelector("#viewMapBtn").classList.add('map-active');
        };
      })

      const directionBtn = document.querySelectorAll(".eachPopupDirection");
      const nearbyBtn = document.querySelectorAll(".eachPopupNearby");
      const weatherBtn = document.querySelectorAll(".eachPopupWeather");
      directionBtn.forEach((eachDirectionBtn) => {
        eachDirectionBtn.onclick = () => {
          nearbyLayer.clearLayers();
          changeSidebar('#directionContainer');
        }
      });
      nearbyBtn.forEach((eachNearbyBtn) => {
        eachNearbyBtn.onclick = () => {
          directionLayer.clearLayers();
          changeSidebar('#nearbyContainer');
        }
      });
      weatherBtn.forEach((eachWeatherBtn) => {
        eachWeatherBtn.onclick = () => {
          directionLayer.clearLayers();
          nearbyLayer.clearLayers();
          changeSidebar('#weatherContainer');
        }
      });
    })
  } 



  // For mobile responsive search container
  const navSearchDiv = document.querySelector(".searchContainer");
  document.querySelector("#navSearchBtn").addEventListener("click", function(){
    document.querySelector("#navLeft span").classList.toggle("active");
    document.querySelector(".homeBtn").classList.toggle("active");
    document.querySelector(".mapBtn").classList.toggle("active");
    document.querySelector("#navSearchBtn .bx-search-alt").classList.toggle("active");
    document.querySelector("#navSearchBtn .bx-x").classList.toggle("active");
    document.querySelector(".autocom-box").classList.toggle("inactive");
    navSearchDiv.classList.toggle("active");
  })
  
})  

async function loading(){
  const mapPageContainer = document.querySelector("#mapPage");
  mapPageContainer.style.background = `url("./assets/loading.gif") no-repeat right center`;
  await getOMAuthorization();
};