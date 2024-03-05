/**
 * Get route and gym information from 'routes.json'
 * @returns Array of routes and gyms in each country
 */
async function getRouteData() {
  const response = await axios.get("json-files/routes.json");
  return response.data;
}


async function getCountryData() {
  const response = await axios.get("json-files/countries.json");
  return response.data;
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
  stateSelect = document.querySelector('#mapState');
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

async function createMapSelect(map) {
  const countryData = await getCountryData();
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