let sgCenter = [1.3521, 103.8198];
let map = L.map('map', {minZoom: 8, maxZoom: 18,}).setView(sgCenter, 11);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

const historicSiteIcon = L.icon({
    iconUrl: './images/icons/site.png',
    iconSize: [45, 45],
})

const monumentIcon = L.icon({
    iconUrl: './images/icons/monument.png',
    iconSize: [45, 45],
})

const museumIcon = L.icon({
    iconUrl: './images/icons/museum.png',
    iconSize: [45, 45],
})

const randomIcon = L.icon({
    iconUrl: './images/icons/star.png',
    iconSize: [45, 45],
})

const searchIcon = L.icon({
    iconUrl: './images/icons/star.png',
    iconSize: [45, 45],
})

const manIcon = L.icon({
    iconUrl: './images/icons/man.png',
    iconSize: [45, 45],
})

// "Fair & Warm" "Fair (Day)" icon
const sunnyIcon = L.icon({
    iconUrl: './images/icons/sun.png',
    iconSize: [40, 40],
})

// "Cloudy" icon. Default icon (if cannot find in dict, default to this) 
const cloudyIcon = L.icon({
    iconUrl: './images/icons/cloudy.png',
    iconSize: [40, 40],
})

// "Partly Cloudy (Day)" icon
const cloudyDayIcon = L.icon({
    iconUrl: './images/icons/cloudy-day.png',
    iconSize: [40, 40],
})

// "Partly Cloudy (Night)" icon
const cloudyNightIcon = L.icon({
    iconUrl: './images/icons/cloudy-night.png',
    iconSize: [40, 40],
})

// "Light Showers" "Light Rain" "Moderate Rain" "Showers" icon
const rainIcon = L.icon({
    iconUrl: './images/icons/rain.png',
    iconSize: [40, 40],
})

// "Thundery Showers" "Heavy Thundery Showers" icon
const thunderIcon = L.icon({
    iconUrl: './images/icons/thunder.png',
    iconSize: [40, 40],
})

// weather icons. if don't meet any of the weather forecast below. default to cloudy
const weatherIcons = {
    "Fair & Warm": sunnyIcon,
    "Fair (Day)": sunnyIcon,
    "Partly Cloudy (Day)": cloudyDayIcon,
    "Cloudy": cloudyIcon,
    "Partly Cloudy (Night)": cloudyNightIcon,
    "Light Showers": rainIcon,
    "Light Rain": rainIcon,
    "Moderate Rain": rainIcon,
    "Showers": rainIcon,
    "Thundery Showers": thunderIcon,
    "Heavy Thundery Showers": thunderIcon
}