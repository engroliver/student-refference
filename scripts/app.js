let navbarLinks = document.querySelectorAll('.navbar-nav > .nav-link')

for (let link of navbarLinks) {
    link.addEventListener('click', function(event){
        let selectedLink = event.target;
        let pageName = selectedLink.dataset.page;

        let pages = document.querySelectorAll('.page');
        for (let p of pages) {
            p.classList.remove('show');
            p.classList.add('hidden');
        }
        let page = document.querySelector('#'+ pageName +'-page')
        page.classList.remove('hidden');
        page.classList.add('show');
    })
}