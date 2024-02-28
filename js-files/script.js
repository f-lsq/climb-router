document.addEventListener('DOMContentLoaded', function(){
  sgCoordinates = [1.3521, 103.8198]
  const map = createMap('map', sgCoordinates);
  getLocation()
})  

function getLocation() {
  if (navigation.geolocation) {
    console.log(navigator.geolocation.watchPosition())
  } else {
    console.log("Geolocation failed")
  }
}