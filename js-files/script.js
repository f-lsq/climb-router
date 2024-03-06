USER_COORDINATES = [1.3548, 103.7763];
getLocation();

document.addEventListener('DOMContentLoaded', async function(){
  const locationData = await getLocationData();
  const countryData = await getCountryData();
  // Switch to Map Page from Home Page
  const homeBtn = document.querySelector('.homeBtn');
  const mapBtn = document.querySelector('.mapBtn');
  const homePage = document.querySelector('#homePage')
  const mapPage = document.querySelector('#mapPage')

  mapBtn.addEventListener("click", async function(){
    homePage.classList.remove('active');
    mapPage.classList.add('active');

    // Create Leaflet Map
    const mapItems = createMap('map', USER_COORDINATES);
    map = mapItems.map;
    createMapSelect(map);

    selectedCountry = 'SG' // SAMPLE
    // createClusterGroup(locationData, map, selectedCountry, 'climbing-gyms')
    // createClusterGroup(locationData, map, selectedCountry, 'climbing-routes')
    createLayerControl(locationData, map, selectedCountry, mapItems.defaultMapTile)



    

    // createLocationLayer(routeData, map, 'SG', 'climbing-gyms');

    // addMarkersToMap(routeData, map, 'SG', 'climbing-gyms');
    // addMarkersToMap(routeData, map, 'SG','climbing-routes');
    

    document.querySelector('#currLocationBtn').addEventListener('click', ()=>{
      map.flyTo(USER_COORDINATES)
    })
  });

  homeBtn.addEventListener('click', function(){
    homePage.classList.add('active');
    mapPage.classList.remove('active');
  });
  
  

})  
