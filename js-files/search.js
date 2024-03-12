function searchLocation(locationData, selectedCountry){
  const searchContainer = document.querySelector(".searchContainer");
  const searchInput = document.querySelector("#navSearch");
  const searchResultsBox = document.querySelector(".autocom-box");

  const gymResults = getAllLocationName(locationData, selectedCountry, "climbing-gyms");
  const locationResults = getAllLocationName(locationData, selectedCountry, "climbing-routes");

  searchInput.onkeyup = function(userInput){
    searchResultsBox.style.padding = "calc(0.5rem + 5px) 1rem 0.5rem 1rem"

    let userData = userInput.target.value; // stores the data entered by users
    let emptyResult = [];
    if (userData){
      searchResultsBox.classList.add("active");
      emptyResult = gymResults.filter(function(data){
        // Filtering array value and converting user input to lowercase
        // This returns results that starts with the user's input
        return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
      }); 
      emptyResult = emptyResult.map(function(data){
        return data = '<li>' + data + '</li>'
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
  document.querySelector("#navSearch").value = result.textContent;
  document.querySelector(".autocom-box").classList.remove("active");
  goToSearchLocation(result.textContent)
}

function displayResults(resultArray, searchResultsBox, searchInput){
  let resultArrayData;
  if(!resultArray.length){
    // If array is empty
      userInput = searchInput.value;
      resultArrayData = '<li>' + userInput + '</li>'
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
