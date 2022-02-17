async function loadHistoricSite(){
    let response = await axios.get('data/historic-sites-geojson.geojson');
    let historicSiteGroup = L.layerGroup()
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
    let monumentGroup = L.layerGroup()
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
    let museumGroup = L.layerGroup() 
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

    };
    let overlays = {
        "Historic Sites": await loadHistoricSite(),
        "Monuments": await loadMonument(),
        "Museums": await loadMuseum(),
    };

    L.control.layers(baseLayers, overlays).addTo(map);

})