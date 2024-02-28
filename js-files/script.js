document.addEventListener('DOMContentLoaded', function(){
  sgCoordinates = [1.3548, 103.7763]
  const map = createMap('map', sgCoordinates);
  console.log("map in script.js", map);

  getCoordinates(map, "singapore","climbing-gyms");
  getCoordinates(map, "singapore","climbing-routes");
})  
