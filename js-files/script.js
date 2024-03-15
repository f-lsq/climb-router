let USER_COORDINATES = [1.3548, 103.7763];
getLocation();

let markerAll = [];

document.addEventListener('DOMContentLoaded', async function(){
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

  

  

})  
