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
    countryData = await getCountryData();
    createCountrySelect(countryData);
    countrySelect = document.querySelector('#mapCountry');
    createStateSelect(countryData, countrySelect.value)
    countrySelect.addEventListener("change", function(){
      selectedCountry = createStateSelect(countryData, countrySelect.value);
      let selectedState = {};
      for (let eachState of selectedCountry.states) {
        console.log(document.querySelector('#mapCountry').value);
        if (eachState.state_code == document.querySelector('#mapCountry').value) {
          selectedState = eachState;
          break;
        }
      }
      
      map.flyTo([selectedState.latitude, selectedState.altitude]);
    })

    addMarkersToMap(await getRouteData(), map, 'SG', 'climbing-gyms');
    addMarkersToMap(await getRouteData(), map, 'US','climbing-routes');
    

    document.querySelector('#currLocationBtn').addEventListener('click', ()=>{
      map.flyTo(USER_COORDINATES)
    })
  });

  homeBtn.addEventListener('click', function(){
    homePage.classList.add('active');
    mapPage.classList.remove('active');
  });
  
  

})  
