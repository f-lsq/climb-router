// Leaflet Map Javascript
document.addEventListener("DOMContentLoaded", function () {
	
	const coordinates = [1.3521, 103.8198] // SG coordinates (can set coordinates depending on user's location)

	const map = L.map('map').setView(coordinates, 13);
	L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
		attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: 0,
		maxZoom: 22,
		accessToken: 'Ks30FORufAmGLwXplyYzbHEuFVCd402Z2nze8jeves02tkNjZYaZZn9t2ybe2OkL'
	}).addTo(map);

	let climbingGymMarkers = L.marker()
})


