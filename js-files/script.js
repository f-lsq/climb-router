document.addEventListener('DOMContentLoaded', function(){
  sgCoordinates = [1.3521, 103.8198]
  const map = createMap('map', sgCoordinates);
  console.log(getLocation());
})  

function getLocation() {
  if (navigation.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longtitude;
      return [lat, lng];
    })
  } else {
    return [1.3521, 103.8198] // Default coordinates - Singapore
  }
}