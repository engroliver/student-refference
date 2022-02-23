// function for single page application
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

// function for sites layers control using radio buttons
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

// function for weather layers control using checkboxes
let checkbox = document.querySelector('.weather-checkbox');
checkbox.addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(weather2hLayer)
    } else {
        map.removeLayer(weather2hLayer)
    }
})

// function to search for sites
// let searchInput = document.querySelector('#search-input');
// let searchBtn = document.querySelector('#search-btn')
// searchBtn.addEventListener('click', function(){
//     console.log(searchInput.value)
// })
