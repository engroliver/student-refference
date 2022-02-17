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

window.addEventListener('DOMContentLoaded', async function(){   
    // loadMuseum();

    let baseLayers = {
        "Historic Sites": await loadHistoricSite(),
        "Monuments": await loadMonument(),
        "Museums": await loadMuseum(),
    };
    let overlays = {

    };

    L.control.layers(baseLayers, overlays).addTo(map);

})