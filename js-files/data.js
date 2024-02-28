async function getCoordinates(map, locationCountry, locationType) {
  const response = await axios.get("json-files/routes.json");
  for (let eachLocation of response.data[locationCountry][locationType]) {
    const coordinates = eachLocation.metadata["parent-lnglat"].reverse();
    const marker = L.marker(coordinates).addTo(map);
  }
}