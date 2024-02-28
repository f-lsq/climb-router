async function getCoordinates(map, locationCountry, locationType) {
  const response = await axios.get("json-files/routes.json");
  for (let eachLocation of response.data[locationCountry][locationType]) {
    const coordinates = eachLocation.metadata["parent-lnglat"].reverse();
    const marker = L.marker([51.5, -0.09]).addTo(map);
    // const marker = L.marker([coordinates]).addto(map);
  }
}