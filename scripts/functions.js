// function to clear all site layers and star (random and search) layer on map
function clearSiteAndStarLayers() {
    if (singleMarker) {
        map.removeLayer(singleMarker)
    }
    map.removeLayer(historicSiteLayer);
    map.removeLayer(monumentLayer);
    map.removeLayer(museumLayer);

    resultsDisplay.style.display = 'none'
    invisibleLayer.style.display = 'none'
}
// function to uncheck all radio buttons
function uncheckRadioBtns() {
    let radios = document.querySelectorAll('.site-radios');
    for (let radio of radios) {
        radio.checked = false
    }
}

// function to uncheck all checkboxes
function uncheckCheckboxes() {
    let checkboxes = document.querySelectorAll('.checkbox');
    for (let checkbox of checkboxes) {
        checkbox.checked = false
    }
}

// function to reset map (e.g. clear ALL layers and radio and checkboxes);
function clearAllLayers() {
    clearSiteAndStarLayers()
    uncheckRadioBtns()
    map.removeLayer(weather2hLayer)
    if (locationMarker) {
        map.removeLayer(locationMarker)
    }
    uncheckCheckboxes()
    invisibleLayer.style.display = 'block'
}

// function to generate marker layer
function loadGeoJsonLayer(data, layerIcon, colNoArray) {
    let group = L.markerClusterGroup();
    L.geoJson(data, {
        'onEachFeature': function (feature, marker) {
            // marker.bindPopup(feature.properties.Description);
            let dummyDiv = document.createElement('div');
            dummyDiv.innerHTML = feature.properties.Description;
            let columns = dummyDiv.querySelectorAll('td');
            let name = columns[colNoArray[0]].innerHTML;
            let desc = columns[colNoArray[1]].innerHTML;
            let img = columns[colNoArray[2]].innerHTML;
            let popupText = `
            <p><strong>${name}</strong></p>
            <p>${desc}</p>
            <img src="${img}" class="center" width="70%" display:block/>`
            marker.bindPopup(popupText)
        },
        'pointToLayer': function (feature, latlng) {
            return L.marker(latlng, { icon: layerIcon })
        }
    }).addTo(group);
    return group
}

// function to generate 2h weather layer
function loadWeather2hLayer(data) {
    let group = L.markerClusterGroup();
    let coordinates = data.area_metadata;
    let forecast = data.items[0].forecasts;
    for (let i = 0; i < coordinates.length; i++) {
        let lat = coordinates[i].label_location.latitude;
        let lng = coordinates[i].label_location.longitude;
        let marker;
        if (weatherIcons[forecast[i].forecast]) {
            marker = L.marker([lat, lng], { icon: weatherIcons[forecast[i].forecast] });
        } else {
            marker = L.marker([lat, lng], { icon: cloudyIcon });
        }
        marker.bindPopup(`<p><strong>Area</strong>: ${forecast[i].area}</p>
                          <p><strong>Forecast</strong>: ${forecast[i].forecast}</p>`)
        marker.addTo(group);
    }
    return group;
}

// function to get 24h weather data
async function loadWeather24H(data) {
    let weather24h = data.items[0].general
    let forecast = weather24h.forecast
    let temp = weather24h.temperature

    document.querySelector('#forecast-24h').innerHTML +=
        `<img src="${weatherIcons[forecast].options.iconUrl}" width="25px" height="25px"> ${forecast} `
    document.querySelector('#temp-24h').innerHTML +=
        `<i class="fa-solid fa-temperature-low" style="color: dodgerblue"></i> ${temp.low}°C / 
         ${temp.high}°C <i class="fa-solid fa-temperature-high" style="color: indianred"></i>`
}

// function to get current coord
async function loadLocationMarker() {
    try {
        let pos = await getLocation()
        let coord = [pos.coords.latitude, pos.coords.longitude]
        let marker = L.marker(coord, { icon: manIcon })
        return marker
    } catch (error) {
        alert('Error: Location services not enabled/available, certain features will not be available');
    }
}

// function to get current postion
function getLocation() {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        )
    } else {
        alert("Geolocation if not supported by this browser")
    }
}

// function for random int to get random location from data
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function flyToAndPopup(coord, icon, name, desc, img) {
    map.flyTo([coord[0] + 0.004, coord[1]], 16);
    singleMarker = L.marker(coord, { icon: icon });

    let popupText = `
    <p><strong>${name}</strong></p>
    <p>${desc}</p>
    <img src="${img}" class="center" width="70%" display:block/>`

    singleMarker.bindPopup(popupText)
    singleMarker.addTo(map)
    singleMarker.openPopup()
}

// function to get description data from the table of a selected feature
function getDescData(data, featureNo, colNoArray) {
    let dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = data[featureNo].properties.Description;
    let columns = dummyDiv.querySelectorAll('td');
    let name = columns[colNoArray[0]].innerHTML;
    let desc = columns[colNoArray[1]].innerHTML;
    let img = columns[colNoArray[2]].innerHTML;

    return {
        name: name,
        desc: desc,
        img: img
    }
}

// function to check if image url exists
async function imageExists(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve(true);
        }
        img.onerror = function (error) {
            resolve(false);
        }
        img.src = url;
    })
}

// function to get random location from data, and append link to map on button
async function getRandomLocation(data, colNoArray, type) { // 
    let randomInt = getRandomInt(0, data.features.length);
    let headerElement = document.querySelector(`#random-${type}-header`);
    let contentElement = document.querySelector(`#random-${type}-content`);
    let imgElement = document.querySelector(`#random-${type}-img`);
    let linkElement = document.querySelector((`#random-${type}-link`));
    let dataFeatures = data.features
    let lat = dataFeatures[randomInt].geometry.coordinates[1];
    let lng = dataFeatures[randomInt].geometry.coordinates[0];

    // get description data from randomly selected location
    let { name, desc, img } = getDescData(dataFeatures, randomInt, colNoArray)
    // check if img url gives an image
    let imgExists = await imageExists(img)
    if (imgExists) {
        imgElement.src = img
    } else {
        imgElement.src = placeholderImgUrl
        img = placeholderImgUrl
    }

    headerElement.innerText = name
    contentElement.innerText = desc

    linkElement.style.display = 'inline'
    // function (eventlistener) to fly to selected point
    linkElement.addEventListener('click', function () {
        let homePage = document.querySelector('#home-page')
        let mapPage = document.querySelector('#map-page')

        // transition to map page
        homePage.classList.remove('show');
        homePage.classList.add('hidden');
        mapPage.classList.remove('hidden');
        mapPage.classList.add('show');

        // remove initial all layer and uncheck all radio
        clearSiteAndStarLayers()
        uncheckRadioBtns()

        flyToAndPopup([lat, lng], randomIcon, name, desc, img)
    })
}


// function for site layers control using radio buttons
function siteLayersControl() {
    clearSiteAndStarLayers()
    invisibleLayer.style.display = 'block'
    if (this.value == 'historic-site') {
        map.addLayer(historicSiteLayer);
    } else if (this.value == 'monument') {
        map.addLayer(monumentLayer);
    } else if (this.value == 'museum') {
        map.addLayer(museumLayer);
    }
}

// function for weather layer control using checkboxes
function weatherLayerControl() {
    if (this.checked) {
        map.addLayer(weather2hLayer)
    } else {
        map.removeLayer(weather2hLayer)
    }
}

// function for current location using checkboxes
function locationMarkerControl() {
    if (this.checked) {
        locationMarker.addTo(map)
        map.flyTo([locationMarker['_latlng'].lat, locationMarker['_latlng'].lng], 16)
    } else {
        map.removeLayer(locationMarker)
    }
}

// function to search for locations
async function searchLocations(searchTerm, data, colNoArray) {
    let transformedArr = [];
    let dataFeatures = data.features
    for (let i = 0; i < dataFeatures.length; i++) {
        let { name, desc, img } = getDescData(dataFeatures, i, colNoArray);
        let coord = [dataFeatures[i].geometry.coordinates[1],
        dataFeatures[i].geometry.coordinates[0]]
        // check if img url gives an image
        let imgExists = await imageExists(img)
        if (!imgExists) {
            img = placeholderImgUrl
        }

        transformedArr.push([name, desc, img, coord])
    }
    let resultsArr = transformedArr.filter(function (location) {
        return location[0].toLowerCase().split(' ').includes(searchTerm)
    })
    return resultsArr
}

// function to display all search results
async function displayAllSearchResults() {
    let searchTerm = document.querySelector('#search-input').value.toLowerCase().trim();
    let allResults;
    locationDiv.style.display = 'none'
    weatherDiv.style.display = 'none'
    resultsDisplay.style.display = 'block'
    invisibleLayer.style.display = 'block'

    if (searchTerm != "") {
        resultsDisplay.innerHTML = "Searching..."

        let historicSiteSearch = await searchLocations(searchTerm, historicSiteData, nameDescImgCol.historic)
        let monumentSearch = await searchLocations(searchTerm, monumentData, nameDescImgCol.monument)
        let museumSearch = await searchLocations(searchTerm, museumData, nameDescImgCol.museum)
        allResults = [...historicSiteSearch, ...monumentSearch, ...museumSearch]
        resultsDisplay.innerHTML = ""

        for (let i = 0; i < allResults.length; i++) {
            let [name, desc, img, coord] = allResults[i]
            resultsDisplay.innerHTML += `<div id="search-${i}"><a href="#" style="text-decoration: none; color: black">${name}</a></div>`
        }

        for (let i = 0; i < allResults.length; i++) {
            let [name, desc, img, coord] = allResults[i]
            let searchElem = document.querySelector(`#search-${i}`)
            searchElem.addEventListener('click', function () {
                clearSiteAndStarLayers()
                uncheckRadioBtns()
                resultsDisplay.style.display = 'none'
                invisibleLayer.style.display = 'none'
                flyToAndPopup(coord, searchIcon, name, desc, img)
            })
        }

        if (!resultsDisplay.innerText) {
            resultsDisplay.innerText = "No results found."
        }
    } else {
        resultsDisplay.innerText = "Please enter something."
    }

    invisibleLayer.addEventListener('click', function () {
        resultsDisplay.style.display = 'none'
        invisibleLayer.style.display = 'none'
    })
}

// function to display and remove weather div
function displayWeatherDiv() {
    resultsDisplay.style.display = 'none'
    locationDiv.style.display = 'none'
    weatherDiv.style.display = 'block'
    invisibleLayer.style.display = 'block'

    invisibleLayer.addEventListener('click', function () {
        weatherDiv.style.display = 'none'
        invisibleLayer.style.display = 'none'
    })
}

// function to display and remove location div
function displayLocationDiv() {
    let currentLocationDiv = document.querySelector('#current-location')
    if (locationMarker) {
        currentLocationDiv.style.display = 'block'
    }

    resultsDisplay.style.display = 'none'
    weatherDiv.style.display = 'none'
    locationDiv.style.display = 'block'
    invisibleLayer.style.display = 'block'

    invisibleLayer.addEventListener('click', function () {
        locationDiv.style.display = 'none'
        invisibleLayer.style.display = 'none'
    })
}

// function to enable and disable suggestion page/overlay
function displaySuggestPage() {
    let suggestPage = document.querySelector('#suggest-page');
    suggestPage.classList.remove('hidden');
    suggestPage.classList.add('show');
    suggestPage.clientWidth;

    let returnToMap = document.querySelector('#back-to');
    returnToMap.addEventListener('click', function() {
        suggestPage.classList.remove('show');
        suggestPage.classList.add('hidden');
    })
}

// function to check suggestion form radio buttons
function checkSuggestRadios() {
    let suggestRadios = document.querySelectorAll('.suggest-radios')
    let selected = false

    for (let radio of suggestRadios) {
        if (radio.checked == true) {
            selected = true
            break
        }
    }
    return selected
}

// function to add error messages
function addErrorMsg(ul, msg) {
    let errorElement = document.createElement('li')
    errorElement.innerHTML = msg
    ul.appendChild(errorElement)
}

// function for suggestion form submission
function suggestSubmit() {
    formMessageDisplay.style.display = 'block'
    formMessageDisplay.innerHTML = ''

    let suggestLocationName = document.querySelector('#suggest-location-name').value
    let suggestLat = document.querySelector('#suggest-lat').value
    let suggestLng = document.querySelector('#suggest-lng').value
    let rgexLat = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
    let rgexLng = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/

    let formError = false
    let errorDiv = document.createElement('div')
    let unorderedList = document.createElement('ul')
    errorDiv.append(unorderedList)
    errorDiv.classList.add('alert', 'alert-danger', 'p-1', 'm-1')

    if (!suggestLocationName) {
        formError = true
        addErrorMsg(unorderedList, 'Enter the location name')
    }

    if (!checkSuggestRadios()) {
        formError = true
        addErrorMsg(unorderedList, 'Select a location type')
    }

    if (!suggestLat || !suggestLng) {
        formError = true
        addErrorMsg(unorderedList, 'Enter the coordinates')
    } else if (!rgexLat.test(suggestLat) || ! rgexLng.test(suggestLng)) {
        formError = true
        addErrorMsg(unorderedList, 'Enter a valid coordinates')
    }

    if (formError) {
        formMessageDisplay.append(errorDiv)
    } else {
        formMessageDisplay.innerHTML = 
            `<div class="alert alert-success p-1 m-1">
                Suggestion received!
             </div>`
    }
}