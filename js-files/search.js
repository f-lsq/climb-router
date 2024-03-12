function searchLocation(){
  const searchContainer = document.querySelector(".searchContainer");
  const searchInput = document.querySelector("#navSearch");
  const searchResultsBox = document.querySelector(".autocom-box");

  const gymResults = getAllLocationName(locationData, selectedCountry, "climbing-gyms");
  const locationResults = getAllLocationName(locationData, selectedCountry, "climbing-routes");

  searchInput.onkeyup = function(userInput){
    let userInput = userInput.target.value; // stores the data entered by users
    let emptyResult = [];
    if (userInput){
      emptyResult = gymResults.filter(function(inputData){
        return inputData.toLocaleLowerCase();
      }); console.log(emptyArray);
    }
  }
}

function getAllLocationName(locationData, selectedCountry, locationType){
  let locationResult = [];
  for (let eachLocation of locationData[selectedCountry][locationType]) {
    locationResult.push(eachLocation.name);
  }
  return locationResult;
}
