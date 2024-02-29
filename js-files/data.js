async function getRouteData() {
  const response = await axios.get("json-files/routes.json");
  return response.data;
}

async function getCountryData() {
  const response = await axios.get("json-files/countries.json");
  return response.data;
}

async function createMapSelect() {
  countrySelect = document.querySelector("#map-country");
  stateSelect = document.querySelector("#map-state");

  const countryData = await getCountryData();
  console.log(countryData);
}