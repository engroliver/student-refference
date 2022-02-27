async function getData(dataURL) {
    let response = await axios.get(dataURL);
    return response.data
}

// function to clear all site layers and star (random and search) layer on map
function clearSiteAndStarLayers() {
    if (singleMarker) {
        map.removeLayer(singleMarker)
    }
    map.removeLayer(historicSiteLayer);
    map.removeLayer(monumentLayer);
    map.removeLayer(museumLayer);

    let resultsDisplay = document.querySelector('#search-results-display')
    let invisibleLayer = document.querySelector('#invisible-container')
    resultsDisplay.innerHTML = ""
    invisibleLayer.style.display = 'none'
}
// function to uncheck all radio buttons
function uncheckRadioBtns(){
    let radios = document.querySelectorAll('.site-radios');
    for (let radio of radios) {
        radio.checked = false
    }
}

// function to uncheck all checkboxes
function uncheckCheckboxes(){
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
    map.removeLayer(locationMarker)
    uncheckCheckboxes()
}

// function to generate marker layer
function loadGeoJsonLayer(data, layerIcon, colNoArray) {
    // let data = await getData(geoJSONFile);
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
            marker.bindPopup(`
            <p><strong>${name}</strong></p>
            <p>${desc}</p>
            <img src="${img}" class="center" width='200px' display:block/>
            `)
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
        `<img src="${weatherIcons[forecast].options.iconUrl}" width="7%"> ${forecast} `
    document.querySelector('#temp-24h').innerHTML += 
        `<i class="fa-solid fa-temperature-low" style="color: dodgerblue"></i> ${temp.low}°C / 
         <i class="fa-solid fa-temperature-high" style="color: indianred"></i> ${temp.high}°C`
}

// function to get current coord
async function loadLocationMarker() {
    try {
        let pos = await getLocation()
        let coord = [pos.coords.latitude, pos.coords.longitude]
        let marker = L.marker(coord, {icon: manIcon})
        return marker
    } catch(error) {
        alert('Error: ' + error.message);
    }
}

// function to get current postion
function getLocation(){
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
    singleMarker.bindPopup(`
    <p><strong>${name}</strong></p>
    <p>${desc}</p>
    <img src="${img}" class="center" width='200px' display:block/>
    `)
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

    return {name: name, 
            desc: desc, 
            img: img}
}

// function to get random location from data, and append link to map on button
function getRandomLocation(data, colNoArray, type) { // 
    let randomInt = getRandomInt(0, data.features.length);
    let headerElement = document.querySelector(`#random-${type}-header`);
    let contentElement = document.querySelector(`#random-${type}-content`);
    let imgElement = document.querySelector(`#random-${type}-img`);
    let linkElement = document.querySelector((`#random-${type}-link`));
    let dataFeatures = data.features
    let lat = dataFeatures[randomInt].geometry.coordinates[1];
    let lng = dataFeatures[randomInt].geometry.coordinates[0];

    // get description data from randomly selected location
    let {name, desc, img} = getDescData(dataFeatures, randomInt, colNoArray)

    headerElement.innerText = name
    contentElement.innerText = desc
    imgElement.src = img

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
    if(this.checked) {
        locationMarker.addTo(map)
        map.flyTo([locationMarker['_latlng'].lat, locationMarker['_latlng'].lng], 16)
    } else {
        map.removeLayer(locationMarker)
    }
}

// function to search for locations
function searchLocations(searchTerm, data, colNoArray) {
    let transformedArr = [];
    let dataFeatures = data.features
    for (let i = 0; i < dataFeatures.length; i++) {
        let {name, desc, img} = getDescData(dataFeatures, i, colNoArray);
        let coord = [dataFeatures[i].geometry.coordinates[1],
                     dataFeatures[i].geometry.coordinates[0]]
        transformedArr.push([name, desc, img, coord])
    }
    let resultsArr = transformedArr.filter(function (location) {
        return location[0].toLowerCase().includes(searchTerm)
    })
    return resultsArr
}

// function to display all search results
function displayAllSearchResults() {
    let searchTerm = document.querySelector('#search-input').value.toLowerCase();
    let resultsDisplay = document.querySelector('#search-results-display')
    let invisibleLayer = document.querySelector('#invisible-container')
    let allResults;

    // console.log(searchTerm)
    if (searchTerm != "" && searchTerm != " ") {
        invisibleLayer.style.display = 'block'
        resultsDisplay.innerHTML = ""
        allResults = [...searchLocations(searchTerm, historicSiteData, nameDescImgCol.historic),
                      ...searchLocations(searchTerm, monumentData, nameDescImgCol.monument),
                      ...searchLocations(searchTerm, museumData, nameDescImgCol.museum)]

        for (let i = 0; i < allResults.length; i++) {
            let [name, desc, img, coord] = allResults[i]
            resultsDisplay.innerHTML += `<div id="search-${i}"><a href="#">${name}</a></div>`
            
            // let searchElem = document.querySelector(`#search-${i}`)
            // searchElem.addEventListener('click', function(){
            //     console.log(name)
            // })
        }

        for (let i = 0; i < allResults.length; i++) {
            let [name, desc, img, coord] = allResults[i]
            let searchElem = document.querySelector(`#search-${i}`)
            searchElem.addEventListener('click', function(){
                // console.log(name)
                clearSiteAndStarLayers()
                uncheckRadioBtns()
                resultsDisplay.innerHTML = ""
                invisibleLayer.style.display = 'none'
                flyToAndPopup(coord, searchIcon, name, desc, img)
            })
        }
    }

    invisibleLayer.addEventListener('click', function () {
        resultsDisplay.innerHTML = ""
        invisibleLayer.style.display = 'none'
    })
}