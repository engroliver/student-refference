async function getData(dataURL) {
    let response = await axios.get(dataURL);
    return response.data
}

// function to generate marker layer
function loadGeoJsonLayer(data, layerIcon, nameColNo, descColNo, imgColNo) {
    // let data = await getData(geoJSONFile);
    let group = L.markerClusterGroup();
    L.geoJson(data, {
        'onEachFeature': function (feature, marker) {
            // marker.bindPopup(feature.properties.Description);
            let dummyDiv = document.createElement('div');
            dummyDiv.innerHTML = feature.properties.Description;
            let columns = dummyDiv.querySelectorAll('td');
            let name = columns[nameColNo].innerHTML;
            let desc = columns[descColNo].innerHTML;
            let img = columns[imgColNo].innerHTML;
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

// function to load 2h weather data
function loadWeather2h(data) {
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

// function to get random location from data
function getRandomLocation(data, nameColNo, descColNo, imgColNo, type) { // 
    let randomInt = getRandomInt(0, data.features.length);
    let headerElement = document.querySelector(`#random-${type}-header`);
    let contentElement = document.querySelector(`#random-${type}-content`);
    let imgElement = document.querySelector(`#random-${type}-img`);
    let linkElement = document.querySelector((`#random-${type}-link`))

    let dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = data.features[randomInt].properties.Description;
    let columns = dummyDiv.querySelectorAll('td');
    let name = columns[nameColNo].innerHTML;
    let desc = columns[descColNo].innerHTML;
    let img = columns[imgColNo].innerHTML;

    headerElement.innerText = name
    contentElement.innerText = desc
    imgElement.src = img

    // function (eventlistener) to fly to selected point
    linkElement.addEventListener('click', function(){
        let homePage = document.querySelector('#home-page')
        let mapPage = document.querySelector('#map-page')

        homePage.classList.remove('show');
        homePage.classList.add('hidden');
        mapPage.classList.remove('hidden');
        mapPage.classList.add('show');


    })
}

// defining variables, loading data and adding layers to map
let historicSiteData;
let monumentData;
let museumData;
let weather2hData;

let historicSiteLayer;
let monumentLayer;
let museumLayer;
let weather2hLayer;

window.addEventListener('DOMContentLoaded', async function () {
    let historicSiteReq = axios.get('data/historic-sites-geojson.geojson');
    let monumentReq = axios.get('data/monuments-geojson.geojson');
    let museumReq = axios.get('data/museums-geojson.geojson');
    let weatherReq = axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');

    let historicSiteRes = await historicSiteReq;
    let monumentRes = await monumentReq;
    let museumRes = await museumReq;
    let weather2hRes = await weatherReq;

    historicSiteData = historicSiteRes.data;
    monumentData = monumentRes.data;
    museumData = museumRes.data;
    weather2hData = weather2hRes.data;

    historicSiteLayer = loadGeoJsonLayer(historicSiteData, historicSiteIcon, 4, 6, 3).addTo(map);
    monumentLayer = loadGeoJsonLayer(monumentData, monumentIcon, 8, 14, 9);
    museumLayer = loadGeoJsonLayer(museumData, museumIcon, 9, 5, 10);
    weather2hLayer = loadWeather2h(weather2hData);

    getRandomLocation(historicSiteData, 4, 6, 3, "site")
    getRandomLocation(monumentData, 8, 14, 9, "monument")
    getRandomLocation(museumData, 9, 5, 10, "museum") 
})