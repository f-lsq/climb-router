function searchLocation(locationData, selectedCountry){
  const searchContainer = document.querySelector(".searchContainer");
  const searchInput = document.querySelector("#navSearch");
  const searchResultsBox = document.querySelector(".autocom-box");

  const gymResults = getAllLocationName(locationData, selectedCountry, "climbing-gyms");
  const locationResults = getAllLocationName(locationData, selectedCountry, "climbing-routes");
  const allResults = gymResults.concat(locationResults);

  searchInput.onkeyup = function(userInput){
    let userData = userInput.target.value; // stores the data entered by users
    let emptyResult = [];
    if (userData){
      searchResultsBox.classList.add("active");
      emptyResult = allResults.filter(function(data){
        // Filtering array value and converting user input to lowercase
        // This returns results that starts with the user's input
        return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
      }); 

      emptyResult = emptyResult.map(function(data){
        if (gymResults.includes(data)) {
          return data = '<li>' + data + '<span class="navSearchGym">gym</span></li>'
        } else {
          return data = '<li>' + data + '<span class="navSearchRoute">route</span></li>'
        }
      })
    } else {
      searchResultsBox.classList.remove("active");
      
    }
    // Display all results
    displayResults(emptyResult, searchResultsBox, searchInput);
    
    // Onclick event for a result
    let allResult = searchResultsBox.querySelectorAll("li");
    for (let i = 0; i < allResult.length; i++) {
      allResult[i].setAttribute("onclick","selectResult(this)");
    }
  }
}

function selectResult(result){
  // Replace search input with selected result
  document.querySelector("#navSearch").value = result.firstChild.textContent;
  document.querySelector(".autocom-box").classList.remove("active");
  goToSearchLocation(result.firstChild.textContent)
}

function displayResults(resultArray, searchResultsBox, searchInput){
  let resultArrayData;
  if(!resultArray.length){
    // If array is empty
      userInput = searchInput.value;
      resultArrayData = '<li>"' + userInput + '" is not found. </li>'
  } else {
    // If array is not empty
    resultArrayData = resultArray.join('');
  }
  searchResultsBox.innerHTML = resultArrayData;
}

function getAllLocationName(locationData, selectedCountry, locationType){
  let locationResult = [];
  for (let eachLocation of locationData[selectedCountry][locationType]) {
    locationResult.push(eachLocation.name);
  }
  return locationResult;
}
