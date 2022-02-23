// defining variables
let historicSiteData;
let monumentData;
let museumData;
let weather2hData;

let historicSiteLayer;
let monumentLayer;
let museumLayer;
let weather2hLayer;
let randomMarker;

// the col number is based on table data from the geojson file
let nameDescImgCol = {
    historic: [4, 6, 3],
    monument: [8, 14, 9],
    museum: [9, 5, 10],
}

// loading data and adding layers to map
window.addEventListener('DOMContentLoaded', async function () {
    let historicSiteReq = axios.get('data/historic-sites-geojson.geojson');
    let monumentReq = axios.get('data/monuments-geojson.geojson');
    let museumReq = axios.get('data/museums-geojson.geojson');
    let weather2hReq = axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
    let weather24hReq = axios.get('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast');

    let historicSiteRes = await historicSiteReq;
    let monumentRes = await monumentReq;
    let museumRes = await museumReq;
    let weather2hRes = await weather2hReq;
    let weather24hRes = await weather24hReq

    historicSiteData = historicSiteRes.data;
    monumentData = monumentRes.data;
    museumData = museumRes.data;
    weather2hData = weather2hRes.data;
    weather24hData = weather24hRes.data;

    historicSiteLayer = loadGeoJsonLayer(historicSiteData, historicSiteIcon, nameDescImgCol.historic).addTo(map);
    monumentLayer = loadGeoJsonLayer(monumentData, monumentIcon, nameDescImgCol.monument);
    museumLayer = loadGeoJsonLayer(museumData, museumIcon, nameDescImgCol.museum);
    weather2hLayer = loadWeather2hLayer(weather2hData);
    loadWeather24H(weather24hData)

    getRandomLocation(historicSiteData, nameDescImgCol.historic, "site")
    getRandomLocation(monumentData, nameDescImgCol.monument, "monument")
    getRandomLocation(museumData, nameDescImgCol.museum, "museum") 
})

// event listener for single page application
let navbarLinks = document.querySelectorAll('.navbar-nav > .nav-link')
for (let link of navbarLinks) {
    link.addEventListener('click', function (event) {
        let selectedLink = event.target;
        let pageName = selectedLink.dataset.page;

        let pages = document.querySelectorAll('.page');
        for (let p of pages) {
            p.classList.remove('show');
            p.classList.add('hidden');
        }
        let page = document.querySelector('#' + pageName + '-page')
        page.classList.remove('hidden');
        page.classList.add('show');
        page.clientWidth;
    })
}

// event listener for sites layers control using radio buttons
let radios = document.querySelectorAll('.site-radios');
for (let radio of radios) {
    radio.addEventListener('change', function () {
        clearAllLayers()
        if (radio.value == 'historic-site') {
            map.addLayer(historicSiteLayer);
        } else if (radio.value == 'monument') {
            map.addLayer(monumentLayer);
        } else if (radio.value == 'museum') {
            map.addLayer(museumLayer);
        }
    })
}

// event listener for weather layers control using checkboxes
let checkbox = document.querySelector('.weather-checkbox');
checkbox.addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(weather2hLayer)
    } else {
        map.removeLayer(weather2hLayer)
    }
})

// event listener to search
let searchBtn = document.querySelector('#search-btn')
searchBtn.addEventListener('click', allSearchResults)
