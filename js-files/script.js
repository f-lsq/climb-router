
document.addEventListener('DOMContentLoaded', async function(){
  sgCoordinates = [1.3548, 103.7763]
  const map = createMap('map', sgCoordinates);
  
  addMarkersToMap(await getRouteData(), map, "singapore","climbing-gyms");
  addMarkersToMap(await getRouteData(), map, "singapore","climbing-routes");
  createMapSelect();
})  
