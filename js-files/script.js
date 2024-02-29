

document.addEventListener('DOMContentLoaded', function(){
  sgCoordinates = [1.3548, 103.7763]
  const map = createMap('map', sgCoordinates);

  getUserLocation();
  

  getCoordinates(map, "singapore","climbing-gyms");
  getCoordinates(map, "singapore","climbing-routes");
  console.log("main.js:", USER_COORDINATES);
})  
