// Leaflet Map Javascript

/**
 * Create a Leaflet map
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




