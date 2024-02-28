document.addEventListener('DOMContentLoaded', function(){
  sgCoordinates = [1.3521, 103.8198]
  const map = createMap('map', sgCoordinates);
  console.log("map in script.js", map);

  getCoordinates(map, "singapore","climbing-gyms");
})  
