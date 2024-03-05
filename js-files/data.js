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
  return selectedCountry;
}

