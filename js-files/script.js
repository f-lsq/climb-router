USER_COORDINATES = [1.3548, 103.7763];
getLocation();

document.addEventListener('DOMContentLoaded', async function(){
  // Switch to Map Page from Home Page
  const homeBtn = document.querySelector('.homeBtn');
  const mapBtn = document.querySelector('.mapBtn');
  const homePage = document.querySelector('#homePage')
  const mapPage = document.querySelector('#mapPage')

  mapBtn.addEventListener("click", async function(){
    homePage.classList.remove('active');
    mapPage.classList.add('active');

    // Create Leaflet Map
    const map = createMap('map', USER_COORDINATES);
    createMapSelect(map);

    const routeData = await getRouteData();
    createLocationLayer(routeData, map, 'SG', 'climbing-gyms');

    addMarkersToMap(routeData, map, 'SG', 'climbing-gyms');
    addMarkersToMap(routeData, map, 'SG','climbing-routes');
    

    document.querySelector('#currLocationBtn').addEventListener('click', ()=>{
      map.flyTo(USER_COORDINATES)
    })
  });

  homeBtn.addEventListener('click', function(){
    homePage.classList.add('active');
    mapPage.classList.remove('active');
  });
  
  

})  
