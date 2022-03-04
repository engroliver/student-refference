// defining variables
let historicSiteData;
let monumentData;
let museumData;
let weather2hData;

let historicSiteLayer;
let monumentLayer;
let museumLayer;
let weather2hLayer;
let singleMarker;
let locationMarker;

const placeholderImgUrl = 'images/no-photo.png'

let resultsDisplay = document.querySelector('#search-results-display')
let locationDiv = document.querySelector('#location-div')
let weatherDiv = document.querySelector('#weather-div')
let invisibleLayer = document.querySelector('#invisible-container')
let formMessageDisplay = document.querySelector('#form-message-display')

// the col number is based on table data from the geojson file
const nameDescImgCol = {
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
    locationMarker = await loadLocationMarker()

    historicSiteData = historicSiteRes.data;
    monumentData = monumentRes.data;
    museumData = museumRes.data;
    weather2hData = weather2hRes.data;
    weather24hData = weather24hRes.data;

    historicSiteLayer = loadGeoJsonLayer(historicSiteData, historicSiteIcon, nameDescImgCol.historic).addTo(map);
    monumentLayer = loadGeoJsonLayer(monumentData, monumentIcon, nameDescImgCol.monument);
    museumLayer = loadGeoJsonLayer(museumData, museumIcon, nameDescImgCol.museum);
    weather2hLayer = loadWeather2hLayer(weather2hData);
    loadWeather24H(weather24hData);

    getRandomLocation(historicSiteData, nameDescImgCol.historic, "site")
    getRandomLocation(monumentData, nameDescImgCol.monument, "monument")
    getRandomLocation(museumData, nameDescImgCol.museum, "museum")
})

// event listener for single page application
let iconLinks = document.querySelectorAll('.page-nav')
for (let link of iconLinks) {
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

// event listener for suggestion page/overlay
let suggestLink = document.querySelectorAll('.suggest-icon');
for (let link of suggestLink) {
    link.addEventListener('click', displaySuggestPage)
}

// event listener for sites layers control using radio buttons
let radios = document.querySelectorAll('.site-radios');
for (let radio of radios) {
    radio.addEventListener('change', siteLayersControl)
}

// event listener for weather layer control using checkboxes
let weatherCheckbox = document.querySelector('#weather-2h-checkbox');
weatherCheckbox.addEventListener('change', weatherLayerControl)

// event listener for location marker control using checkboxes
let locationCheckbox = document.querySelector('#current-location-checkbox');
locationCheckbox.addEventListener('change', locationMarkerControl)

// event listener to display search results
let searchBtn = document.querySelector('#search-btn')
searchBtn.addEventListener('click', displayAllSearchResults)

let searchInput = document.querySelector('#search-input')
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        displayAllSearchResults()
    }
})

// event listener to reset map
let resetBtn = document.querySelector('#reset-map')
resetBtn.addEventListener('click', clearAllLayers)

// event listener to open weather div
let weatherBtn = document.querySelector('#weather-btn')
weatherBtn.addEventListener('click', displayWeatherDiv)

// event listener to open control layer div
let siteBtn = document.querySelector('#location-btn')
siteBtn.addEventListener('click', displayLocationDiv)

// event listener to submit suggestion
let suggestBtn = document.querySelector('#suggest-btn');
suggestBtn.addEventListener('click', suggestSubmit)

