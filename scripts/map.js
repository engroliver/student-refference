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

//placeholder weather icon
const weatherIcon = L.icon({
    iconUrl: './images/icons/weather.png',
    iconSize: [40, 40],
})

// weather icons
// const weatherIcons = {
//     'Partly Cloudy (Day)': , //valid but have to access using object.['key name']
//     'Rain'
//     'Showers'
//     'Thundery showers'
//     'Fair'
//     'Hazy'
//     'Cloudy'
//     'Overcast'
// }