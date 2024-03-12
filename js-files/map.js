// LEAFLET MAP JAVASCRIPT

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  USER_COORDINATES = [position.coords.latitude, position.coords.longitude];
}

/**
 * - Create a Leaflet map
 * @param {string} mapContainerID - ID of element that will display the map
 * @param {array} coordinates - Coordinates of center of displayed map, in the format [latitude, longitude]
 * @returns An object that represents the Leaflet map 
 */
function createMap(mapContainerID, coordinates){
  const defaultMapTile = L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    accessToken: 'Ks30FORufAmGLwXplyYzbHEuFVCd402Z2nze8jeves02tkNjZYaZZn9t2ybe2OkL'
  });

	const map = L.map(mapContainerID).setView(coordinates, 13);
  defaultMapTile.addTo(map)

  return {
    'map': map,
    'defaultMapTile': defaultMapTile
  };
}

function createLayerControl(data, map, selectedCountry, defaultMapTile){
  const satelliteMapTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  const climbingGymsLayer = createLayer(data, map, selectedCountry, 'climbing-gyms');
  const climbingRoutesLayer = createLayer(data, map, selectedCountry, 'climbing-routes');

  L.control.layers({
    'Default Map': defaultMapTile,
    'Satellite Map': satelliteMapTile
  }, {
    'Climbing Gyms': climbingGymsLayer,
    'Climbing Routes': climbingRoutesLayer
  }).addTo(map);

}

function createLayer(data, map, locationCountry, locationType) {
  const locationClusterLayer = L.markerClusterGroup();
  locationClusterLayer.addTo(map);
  const markerAll = createMarkers(data, locationCountry, locationType);
  for (eachMarker of markerAll) {
    eachMarker.addTo(locationClusterLayer);
  }
  return locationClusterLayer;
}

/**
 * Creates markers by country and by location type
 * @param {string} locationCountry Country where climbing location is located (eg. SG or US)
 * @param {string} locationType Type of climbing location (ie. Gyms or Route)
 * @returns Array containing all markers created
 */
function createMarkers(data, locationCountry, locationType) {
  let locationTypeIcon = L.icon({
      iconUrl: 'assets/' + locationType +'.webp',
      shadowUrl: 'assets/climbing-shadow.webp',

      iconSize:     [38, 38], // size of the icon
      shadowSize:   [38, 38], // size of the shadow
      iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location
      shadowAnchor: [19, 38],  // the same for the shadow
      popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
  });

  let markerAll = [];
  for (let eachLocation of data[locationCountry][locationType]) {
      const coordinates = eachLocation.metadata["parent-lnglat"].reverse();
      const marker = L.marker(coordinates, {icon: locationTypeIcon}).bindPopup(eachLocation.name);
      markerAll.push(marker);
  }
  return markerAll;
}

async function goToSearchLocation(locationName){
  const locationData = await getLocationData();
  for (let eachLocation of locationData["SG"]["climbing-gyms"]){
    if (eachLocation.name == locationName) {
      map.flyTo(eachLocation.metadata["parent-lnglat"].reverse());
    }
  }
  for (let eachLocation of locationData["SG"]["climbing-routes"]){
    if (eachLocation.name == locationName) {
      map.flyTo(eachLocation.metadata["parent-lnglat"].reverse());
    }
  }
}