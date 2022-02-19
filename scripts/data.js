async function getData(dataURL){
    let response = await axios.get(dataURL);
    return response.data
}

async function loadHistoricSite() {
    let historicSiteData = await getData('data/historic-sites-geojson.geojson');
    let historicSiteGroup = L.markerClusterGroup()
    L.geoJson(historicSiteData, {
        'onEachFeature': function (feature, marker) {
            marker.bindPopup(feature.properties.Description)
        },
        'pointToLayer': function (feature, latlng) {
            return L.marker(latlng, { icon: historicSiteIcon })
        }
    }).addTo(historicSiteGroup);
historicSiteGroup.addTo(map);
return historicSiteGroup;
}

async function loadMonument() {
    let monumentData = await getData('data/monuments-geojson.geojson');
    let monumentGroup = L.markerClusterGroup()
    L.geoJson(monumentData, {
        'onEachFeature': function (feature, marker) {
            marker.bindPopup(feature.properties.Description);
        },
        'pointToLayer': function (feature, latlng) {
            return L.marker(latlng, { icon: monumentIcon })
        }
    }).addTo(monumentGroup);
    monumentGroup.addTo(map)
    return monumentGroup;
}

async function loadMuseum() {
    let museumData = await getData('data/museums-geojson.geojson')
    let museumGroup = L.markerClusterGroup()
    L.geoJson(museumData, {
        'onEachFeature': function (feature, marker) {
            marker.bindPopup(feature.properties.Description);
        },
        'pointToLayer': function (feature, latlng) {
            return L.marker(latlng, { icon: museumIcon })
        }
    }).addTo(museumGroup);
    museumGroup.addTo(map)
    return museumGroup
}

async function loadWeather2H() {
    // let response = await axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
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
    // let museumLayer = await loadGeoJSON('data/museums-geojson.geojson');
    // let monumentLayer = await loadGeoJSON('data/monuments-geojson.geojson');
    // let historicSiteLayer = await loadGeoJSON('data/historic-sites-geojson.geojson');

    let baseLayers = {
        "Historic Sites": await loadHistoricSite(), // historicSiteLayer
        "Monuments": await loadMonument(), // monumentLayer
        "Museums": await loadMuseum(), // museumLayer
    };
    let overlays = {
        "2h Weather Forecast": await loadWeather2H(),
    };

    L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

})