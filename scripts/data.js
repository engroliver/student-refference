// consider combining the 3 function which loads geojson file
async function loadHistoricSite(){
    let response = await axios.get('data/historic-sites-geojson.geojson');
    let historicSiteGroup = L.markerClusterGroup()
    L.geoJson(response.data, {
        'onEachFeature': function(feature, marker){
            marker.bindPopup(feature.properties.Description);
        }
    }).addTo(historicSiteGroup);
    historicSiteGroup.addTo(map);
    return historicSiteGroup;
}

async function loadMonument(){
    let response = await axios.get('data/monuments-geojson.geojson');
    let monumentGroup = L.markerClusterGroup()
    L.geoJson(response.data, {
        'onEachFeature': function(feature, marker){
            marker.bindPopup(feature.properties.Description);
        }
    }).addTo(monumentGroup);
    monumentGroup.addTo(map)
    return monumentGroup;
}

async function loadMuseum(){
    let response = await axios.get('data/museums-geojson.geojson');
    let museumGroup = L.markerClusterGroup()
    L.geoJson(response.data, {
        'onEachFeature': function(feature, marker) {
            marker.bindPopup(feature.properties.Description);
        }
    }).addTo(museumGroup);
    museumGroup.addTo(map)
    return museumGroup
}

async function loadWeather2H(){
    let response = await axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
    let weather2HGroup = L.markerClusterGroup();
    let weatherCoordinates = response.data.area_metadata;
    let weatherForecast = response.data.items[0].forecasts;
    for (let i = 0; i < weatherCoordinates.length; i++) {
        let lat = weatherCoordinates[i].label_location.latitude;
        let lng = weatherCoordinates[i].label_location.longitude;
        let marker = L.marker([lat, lng]);
        marker.bindPopup(`<div>${weatherForecast[i].area}</div>
                          <div>${weatherForecast[i].forecast}</div>`)
        marker.addTo(weather2HGroup);
    }
    weather2HGroup.addTo(map);
    return weather2HGroup;
}

// 24h data do not need to be plotted on to map
// async function loadWeather24H(){
//     let response = await axios.get('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast');
//     let weatherForecast = response.data.items[0].general
// }

window.addEventListener('DOMContentLoaded', async function(){
    let baseLayers = {
        "Historic Sites": await loadHistoricSite(),
        "Monuments": await loadMonument(),
        "Museums": await loadMuseum(),
    };
    let overlays = {
        "2h Weather Forecast": await loadWeather2H(),
    };

    L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);

})