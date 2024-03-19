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

function createLayerControl(data, map, defaultMapTile){
  const satelliteMapTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  const climbingGymsLayer = createLayer(data, map, 'climbing-gyms');
  const climbingRoutesLayer = createLayer(data, map, 'climbing-routes');

  L.control.layers({
    'Default Map': defaultMapTile,
    'Satellite Map': satelliteMapTile
  }, {
    'Climbing Gyms': climbingGymsLayer,
    'Climbing Routes': climbingRoutesLayer
  }).addTo(map);

}

function createLayer(data, map, locationType) {
  const locationClusterLayer = L.markerClusterGroup();
  locationClusterLayer.addTo(map);
  const markerAll = createMarkers(data, locationType);
  for (eachMarker of markerAll) {
    eachMarker.addTo(locationClusterLayer);
  }
  return locationClusterLayer;
}

/**
 * Creates markers by country and by location type
 * @param {string} locationType Type of climbing location (ie. Gyms or Route)
 * @returns Array containing all markers created
 */
function createMarkers(data, locationType) {
  let locationTypeIcon = L.icon({
      iconUrl: 'assets/' + locationType +'.webp',
      shadowUrl: 'assets/climbing-shadow.webp',

      iconSize:     [38, 38], // size of the icon
      shadowSize:   [38, 38], // size of the shadow
      iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location
      shadowAnchor: [19, 38],  // the same for the shadow
      popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
  });

  for (let eachLocationType of data) {
    if (eachLocationType[locationType]) {
      for (let eachLocation of eachLocationType[locationType]){
        const coordinates = eachLocation.metadata["parent-lnglat"].reverse();
        const marker = L.marker(coordinates, {
          "title": eachLocation.metadata["mp-location-id"],
          "icon": locationTypeIcon
        });
        if (locationType == "climbing-gyms") {
          marker.bindPopup(
            `<div class="eachPopup eachGymPopup">
              <img src="${eachLocation.images[0]}"/>
              <div class="eachPopupContent">
                <div class="eachPopupContentTitle">
                  <h1>${eachLocation.name}</h1>
                  <h2>Climbing Gym</h2>
                </div>
                <div class="eachPopupContentSection">
                  <div class="eachPopupOverviewButton" onclick='changeNearbyPopup(".eachPopupOverviewInfo")'>Overview</div>
                  <div class="eachPopupAboutButton" onclick='changeNearbyPopup(".eachPopupAboutInfo")'>About</div>
                </div>
                <div class="eachPopupContentButton">
                  <a class="eachPopupDirection" onclick="changeSidebar('#directionContainer')"><div><i class='bx bxs-direction-right'></i></div><p>Directions</p></a>
                  <a class="eachPopupNearby" onclick="changeSidebar('#nearbyContainer')"><div><i class='bx bx-reset'></i></div><p>Nearby</p></a>
                  <a class="eachPopupWeather" onclick="changeSidebar('#weatherContainer')"><div><i class='bx bxs-sun'></i></div><p>Weather</p></a>
                </div>
                <div class="eachPopupContentInfo">
                  <div class="eachPopupOverviewInfo active"> 
                    <div>
                      <i class='bx bxs-map' ></i><span>${eachLocation.address}</span>
                    </div>
                    <div>
                      <i class='bx bxs-time' ></i>
                      <div>
                        <p>Monday: ${eachLocation["opening-hours"].monday}</p>
                        <p>Tuesday: ${eachLocation["opening-hours"].tuesday}</p>
                        <p>Wednesday: ${eachLocation["opening-hours"].wednesday}</p>
                        <p>Thursday: ${eachLocation["opening-hours"].thursday}</p>
                        <p>Friday: ${eachLocation["opening-hours"].friday}</p>
                        <p>Saturday: ${eachLocation["opening-hours"].saturday}</p>
                        <p>Sunday: ${eachLocation["opening-hours"].sunday}</p>
                      </div>
                    </div>
                    <div>
                      <i class='bx bxs-phone' ></i><span>${eachLocation.contact}</span>
                    </div>
                    <div>
                      <i class='bx bx-globe' ></i><a href="${eachLocation.link}" target="_blank">Visit gym's website</a>
                    </div>
                  </div>
                  <div class="eachPopupAboutInfo">
                    <div class="eachTypeAvailable">
                      <i class='bx bxs-select-multiple'></i>
                    </div>
                    <div>
                      <p><i class='bx bx-credit-card'></i>Price Breakdown</p>
                      <table>
                        <tr>
                          <th>Type of Pass</th>
                          <th>Prices</th>
                        </tr>
                        <tr>
                          <td>Single Entry</td>
                          <td>${eachLocation.prices["single-entry"]}</td>
                        </tr>
                        <tr>
                          <td>5 x Multipass</td>
                          <td>${eachLocation.prices["multi-pass-5"]}</td>
                        </tr>
                        <tr>
                          <td>10 x Multipass</td>
                          <td>${eachLocation.prices["multi-pass-10"]}</td>
                        </tr>
                        <tr>
                          <td>Monthly Pass</td>
                          <td>${eachLocation.prices["monthly-pass"]}</td>
                        </tr>
                        <tr>
                          <td colspan="2">${eachLocation.remarks}</td>
                        </tr>
                      </table>
                    </div>
                  </div> 
                </div>
              </div>
            </div>
            `
          );

          createPopupTypeTags(marker, eachLocation);
        } else {
          marker.bindPopup(
            `<div class="eachPopup eachRoutePopup">
              <img src="${eachLocation.images[0]}"/>
              <div class="eachPopupContent">
                <div class="eachPopupContentTitle">
                  <h1>${eachLocation.name}</h1>
                  <span>${eachLocation.grade.YDS || ""}</span>
                  <h2>Climbing Route</h2>
                </div>
                <div class="eachPopupContentSection">
                  <div class="eachPopupOverviewButton" onclick='changeNearbyPopup(".eachPopupOverviewInfo")'>Overview</div>
                  <div class="eachPopupAboutButton" onclick='changeNearbyPopup(".eachPopupAboutInfo")'>About</div>
                </div>
                <div class="eachPopupContentButton">
                  <a class="eachPopupDirection" onclick="changeSidebar('#directionContainer')"><div><i class='bx bxs-direction-right'></i></div><p>Directions</p></a>
                  <a class="eachPopupNearby" onclick="changeSidebar('#nearbyContainer')"><div><i class='bx bx-reset'></i></div><p>Nearby</p></a>
                  <a class="eachPopupWeather" onclick="changeSidebar('#weatherContainer')"><div><i class='bx bxs-sun'></i></div><p>Weather</p></a>
                </div>
                <div class="eachPopupContentInfo">
                  <div class="eachPopupOverviewInfo active"> 
                    <div>
                      <i class='bx bxs-map' ></i><span>${eachLocation.location || "<i>No location information</i>"}</span>
                    </div>
                    <div>
                      <i class='bx bxs-backpack' ></i><span>${eachLocation.protection || "<i>No protection information</i>"}</span>
                    </div>
                    <div>
                      <i class='bx bx-globe' ></i><a href="${eachLocation.link}" target="_blank">Visit route's website</a>
                    </div>
                  </div>
                  <div class="eachPopupAboutInfo">
                    <div class="eachTypeAvailable">
                      <i class='bx bxs-select-multiple'></i>
                    </div>
                    <div>
                      <i class='bx bxs-info-circle'></i><span>${eachLocation.description || "<i>No description available</i>"}</span>
                    </div>
                    <div>
                      <i class='bx bxs-group'></i>Route Setter: ${eachLocation["route-setter"] || "<i>Nil</i>"}</span>
                    </div>
                    <div>
                      <i class='bx bxs-upvote'></i>First Ascent: ${eachLocation["first-ascent"] || "<i>Nil</i>"}</span>
                    </div>
                  </div> 
                </div>
              </div>
            </div>
            `
          );
          createPopupTypeTags(marker, eachLocation);

        }
        markerAll.push(marker);
    }
    }
  }
  return markerAll;
}

function createUserMarker (map, coordinates) {
  let locationTypeIcon = L.icon({
    iconUrl: 'assets/user-location.webp',
    shadowUrl: 'assets/user-location-shadow.webp',

    iconSize:     [38, 38], // size of the icon
    shadowSize:   [38, 38], // size of the shadow
    iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location
    shadowAnchor: [19, 38],  // the same for the shadow
    popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
});
  const marker = L.marker(coordinates, {icon: locationTypeIcon}).addTo(map);
}

async function getSearchLocation(locationName){
  const locationData = await getLocationData();
  const allLocation = locationData[0]["climbing-gyms"].concat(locationData[1]["climbing-routes"]);
  for (let eachLocation of allLocation) {
    if (eachLocation.name == locationName) {
      return eachLocation.metadata["parent-lnglat"].reverse();
    }
  }
}

async function goToSearchLocation(locationName){
  map.flyTo(await getSearchLocation(locationName), 20);
}

async function createNearbyMarkers(map, nearbySpotLayer, searchTerm, locationLat, locationLng) {
  const nearbySpotData = await getFourSquareData(locationLat, locationLng, searchTerm);
  const nearbySearchResultsDiv = document.querySelector("#nearbySearchResults");
  
  nearbySearchResultsDiv.innerHTML = "";
  nearbySpotLayer.clearLayers();

  let newSearchTerm = "others"
  if (searchTerm == "toilet" || searchTerm == "restaurant" || searchTerm == "hotel" ) {
    newSearchTerm = searchTerm;
  }

  // Checks if there are results for each nearby spot search
  if (nearbySpotData.results.length > 0) {
    for (let eachNearbySpot of nearbySpotData.results) {
      let nearbySpotIcon = L.icon({
        iconUrl: `assets/${newSearchTerm}.webp`,
        shadowUrl: 'assets/amenities-shadow.webp',
    
        iconSize:     [26, 26], // size of the icon
        shadowSize:   [26, 26], // size of the shadow
        iconAnchor:   [13, 26], // point of the icon which will correspond to marker's location
        shadowAnchor: [13, 26],  // the same for the shadow
        popupAnchor:  [0, -28] // point from which the popup should open relative to the iconAnchor
      });
      const marker = L.marker([
        eachNearbySpot.geocodes.main.latitude, 
        eachNearbySpot.geocodes.main.longitude
      ], {
        icon: nearbySpotIcon
      }).addTo(nearbySpotLayer);
      
      const nearbySpotPhoto = await getFourSquarePhotos(eachNearbySpot.fsq_id);
  
      console.log("nearbySpotData", nearbySpotData);
      console.log("nearbySpotPhoto", nearbySpotPhoto);
  
      let nearbySpotPhotoUrl = "assets/no-image.webp"
      if (nearbySpotPhoto != "not found" && nearbySpotPhoto.length > 0) {
        nearbySpotPhotoUrl = nearbySpotPhoto[0].prefix + nearbySpotPhoto[0].width + "x" + nearbySpotPhoto[0].height + nearbySpotPhoto[0].suffix;
      }
  
      let nearbyCategoryName = "";
      // Checks in category is undefined or an empty array
  
      if (eachNearbySpot.categories && eachNearbySpot.categories.length > 0) {
        nearbyCategoryName = eachNearbySpot.categories[0].name;
      }
  
      marker.bindPopup(`
      <div class="eachPopup eachNearbyPopup">
        <img src="${nearbySpotPhotoUrl}">
        <div class="eachPopupContentTitle">
          <h1>${eachNearbySpot.name}</h1>
          <h2>${nearbyCategoryName}</h2>
        </div>
        <div class="eachPopupContentSection">
          <div class="eachPopupOverviewBtn">Overview</div>
        </div>
        <div class="eachPopupOverview active">
          <div>
            <i class='bx bxs-map' ></i><span>${eachNearbySpot.location.formatted_address}</span>
          </div>
          <div>
            <i class='bx bxs-timer' ></i><span>${eachNearbySpot.closed_bucket}</span>
          </div>
        </div>
      </div>
      `)
  
      const eachNearbySearchResultDiv = document.createElement("div");
      eachNearbySearchResultDiv.setAttribute("class", "eachNearbySearchResult");
      eachNearbySearchResultDiv.innerHTML = `
      <div class="eachNearbySearchTitle">
        <h1 class="eachNearbySearchTitle">${eachNearbySpot.name}</h1>
        <span class="${eachNearbySpot.closed_bucket}">${eachNearbySpot.closed_bucket}</span>
      </div>
      <div class="eachNearbySearchContent">
        <span>${nearbyCategoryName}</span> &#183;
        <span>${eachNearbySpot.location.address}</span>
      </div>
      `
  
      nearbySearchResultsDiv.append(eachNearbySearchResultDiv);
    }
  } else {
    nearbySearchResultsDiv.innerHTML = `No nearby ${searchTerm} found.`;
  }
  
  


}

function createPopupTypeTags(marker, eachLocation) {
  const eachPopupContentString = marker.getPopup().getContent();
    // Creating a temp div to convert popup string to HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = eachPopupContentString;
    const eachPopupContent = tempContainer.firstChild;
    for (let eachType of eachLocation.type) {
        const eachTypeDiv = document.createElement("span");
        eachTypeDiv.classList.add(eachType);
        eachTypeDiv.innerHTML = capitaliseString(eachType);
        // Append each type icon to the current marker's popup content
        eachPopupContent.querySelector('.eachTypeAvailable').appendChild(eachTypeDiv);
      }
    marker.bindPopup(eachPopupContent);
}

function addRouteToMap(routeData, directionLayer) {
  directionLayer.clearLayers();
  const polylineNew = L.Polyline.fromEncoded(routeData.route_geometry,{
    color: '#b5050f',
    weight: 3,
    opacity: 0.6
});
  polylineNew.addTo(directionLayer);
}