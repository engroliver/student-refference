async function getData(dataURL) {
    let response = await axios.get(dataURL);
    return response.data
}

// function to clear all existing layers on map
function clearAllLayers() {
    if (randomMarker) {
        map.removeLayer(randomMarker)
    }
    map.removeLayer(historicSiteLayer);
    map.removeLayer(monumentLayer);
    map.removeLayer(museumLayer);
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
            <img src="${img}" height='200px' display:block/>
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
    // let data = await getData('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
    let group = L.markerClusterGroup();
    let coordinates = data.area_metadata;
    let forecast = data.items[0].forecasts;
    for (let i = 0; i < coordinates.length; i++) {
        let lat = coordinates[i].label_location.latitude;
        let lng = coordinates[i].label_location.longitude;
        let marker = L.marker([lat, lng], {icon: weatherIcon});
        marker.bindPopup(`<p><strong>Area</strong>: ${forecast[i].area}</p>
                          <p><strong>Forecast</strong>: ${forecast[i].forecast}</p>`)
        marker.addTo(group);
    }
    return group;
}

// 24h data do not need to be plotted on to map
// async function loadWeather24H(){
//     let response = await axios.get('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast');
//     let weatherForecast = response.data.items[0].general
// }

// function for random int to get random location from data
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function flyToAndPopup(coord, icon, name, desc, img){
    map.flyTo(coord, 16);
    randomMarker = L.marker(coord, {icon: icon});
    randomMarker.bindPopup(`
    <p><strong>${name}</strong></p>
    <p>${desc}</p>
    <img src="${img}" height='200px' display:block/>
    `)
    randomMarker.addTo(map)
}

// function to get random location from data, and append link to map on button
function getRandomLocation(data, colNoArray, type) { // 
    let randomInt = getRandomInt(0, data.features.length);
    let headerElement = document.querySelector(`#random-${type}-header`);
    let contentElement = document.querySelector(`#random-${type}-content`);
    let imgElement = document.querySelector(`#random-${type}-img`);
    let linkElement = document.querySelector((`#random-${type}-link`));
    let lat = data.features[randomInt].geometry.coordinates[1];
    let lng = data.features[randomInt].geometry.coordinates[0];

    let dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = data.features[randomInt].properties.Description;
    let columns = dummyDiv.querySelectorAll('td');
    let name = columns[colNoArray[0]].innerHTML;
    let desc = columns[colNoArray[1]].innerHTML;
    let img = columns[colNoArray[2]].innerHTML;

    headerElement.innerText = name
    contentElement.innerText = desc
    imgElement.src = img

    // function (eventlistener) to fly to selected point
    linkElement.addEventListener('click', function(){
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