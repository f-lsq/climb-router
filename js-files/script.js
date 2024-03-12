USER_COORDINATES = [1.3548, 103.7763];
getLocation();

document.addEventListener('DOMContentLoaded', async function(){
  const locationData = await getLocationData();
  const countryData = await getCountryData();

  // Create Leaflet Map
  const mapItems = createMap('map', USER_COORDINATES);
  map = mapItems.map;
  createMapSelect(countryData, map);

  selectedCountry = 'SG' // SAMPLE
  createLayerControl(locationData, map, selectedCountry, mapItems.defaultMapTile)

  getAllLocationName(locationData, selectedCountry, "climbing-gyms");

  document.querySelector('#currLocationBtn').addEventListener('click', ()=>{
    map.flyTo(USER_COORDINATES)
  })

  

})  
