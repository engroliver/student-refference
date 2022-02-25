async function getData(dataURL) {
    let response = await axios.get(dataURL);
    return response.data
}

// function to clear all existing layers on map
function clearAllLayers() {
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
        let marker = L.marker([lat, lng], { icon: weatherIcon });
        marker.bindPopup(`<p><strong>Area</strong>: ${forecast[i].area}</p>
                          <p><strong>Forecast</strong>: ${forecast[i].forecast}</p>`)
        marker.addTo(group);
    }
    return group;
}

// 24h data do not need to be plotted on to map
async function loadWeather24H(data) {
    let weather24h = data.items[0].general
    let forecast = weather24h.forecast
    let temp = weather24h.temperature

    document.querySelector('#forecast-24h').innerHTML = `${forecast}`
    document.querySelector('#temp-24h').innerHTML = `${temp.low}°C / ${temp.high}°C`
}

// function for random int to get random location from data
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function flyToAndPopup(coord, icon, name, desc, img) {
    map.flyTo(coord, 16);
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

    return [name, desc, img]
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
    let [name, desc, img] = getDescData(dataFeatures, randomInt, colNoArray)

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
        clearAllLayers()
        let radios = document.querySelectorAll('.site-radios');
        for (let radio of radios) {
            radio.checked = false
        }

        flyToAndPopup([lat, lng], randomIcon, name, desc, img)
    })
}


// function for site layers control using radio buttons
function siteLayersControl() {
    clearAllLayers()
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

// function to search for locations
function searchLocations(searchTerm, data, colNoArray) {
    let cleanedResultsArr = [];
    let resultsArr = data.features.filter(function (location) {
        return location.properties.Description.toLowerCase().includes(searchTerm)
    })

    for (let i = 0; i < resultsArr.length; i++) {
        let [name, desc, img] = getDescData(resultsArr, i, colNoArray)
        let coord = [resultsArr[i].geometry.coordinates[1],
                     resultsArr[i].geometry.coordinates[0]]
        cleanedResultsArr.push([name, desc, img, coord])
    }
    return cleanedResultsArr
}

// function to display all search results
function displayAllSearchResults() {
    let searchTerm = document.querySelector('#search-input').value.toLowerCase();
    let resultsDisplay = document.querySelector('#search-results-display')
    let invisibleLayer = document.querySelector('#invisible-container')
    let allResults;

    // console.log(searchTerm)
    if (searchTerm != "" && searchTerm != " ") {
        clearAllLayers()
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