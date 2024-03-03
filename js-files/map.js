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
	const map = L.map(mapContainerID).setView(coordinates, 13);
	L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
		attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: 0,
		maxZoom: 22,
		accessToken: 'Ks30FORufAmGLwXplyYzbHEuFVCd402Z2nze8jeves02tkNjZYaZZn9t2ybe2OkL'
	}).addTo(map);

	return map;
}

/**
 * 
 * @param {object} data Data from JSON file containing climbing routes and gyms information 
 * @param {object} map Leaflet map object created 
 * @param {string} locationCountry Country selected (dropdown) by users
 * @param {string} locationType Type of climbing locaiton selected (dropdown) by users
 */
function addMarkersToMap(data, map, locationCountry, locationType) {
	const locationClusterLayer = L.markerClusterGroup();
	var locationTypeIcon = L.icon({
    iconUrl: 'assets/' + locationType +'.webp',
    shadowUrl: 'assets/climbing-shadow.webp',

    iconSize:     [38, 38], // size of the icon
    shadowSize:   [38, 38], // size of the shadow
    iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location
    shadowAnchor: [19, 38],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

	for (let eachLocation of data[locationCountry][locationType]) {
    const coordinates = eachLocation.metadata["parent-lnglat"].reverse();
    const marker = L.marker(coordinates, {icon: locationTypeIcon}).addTo(locationClusterLayer);
  }

	locationClusterLayer.addTo(map);
}