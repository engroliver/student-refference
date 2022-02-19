async function getData(dataURL){
    let response = await axios.get(dataURL);
    return response.data
}

async function loadGeoJSON(geoJSONFile, layerIcon){
    let data = await getData(geoJSONFile);
    let group = L.markerClusterGroup();
    L.geoJson(data, {
        'onEachFeature': function(feature, marker){
            marker.bindPopup(feature.properties.Description);
        },
        'pointToLayer': function (feature, latlng) {
            return L.marker(latlng, { icon: layerIcon })
        }
    }).addTo(group);
    group.addTo(map);
    return group
}

async function loadWeather2H() {
    let weather2HData = await getData('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
    let weather2HGroup = L.markerClusterGroup();
    let weatherCoordinates = weather2HData.area_metadata;
    let weatherForecast = weather2HData.items[0].forecasts;
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

window.addEventListener('DOMContentLoaded', async function () {
    let baseLayers = {
        "Historic Sites": await loadGeoJSON('data/historic-sites-geojson.geojson', historicSiteIcon),
        "Monuments": await loadGeoJSON('data/monuments-geojson.geojson', monumentIcon),
        "Museums":  await loadGeoJSON('data/museums-geojson.geojson', museumIcon),
    };
    let overlays = {
        "2h Weather Forecast": await loadWeather2H(),
    };

    L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

})