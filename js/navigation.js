// Fichier: js/navigation.js
function initNavigation() {
    /*=============== SHOW MENU ===============*/
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    /*=============== REMOVE MENU MOBILE ===============*/
    const navLinks = document.querySelectorAll('.nav__link');
    const linkAction = () => {
        if(navMenu) navMenu.classList.remove('show-menu');
    }
    navLinks.forEach(n => n.addEventListener('click', linkAction));

    /*=============== CHANGE BACKGROUND HEADER ===============*/
    const scrollHeader = () => {
        const header = document.getElementById('header');
        if (header) {
            this.scrollY >= 50 ? header.classList.add('scroll-header') : header.classList.remove('scroll-header');
        }
    }
    window.addEventListener('scroll', scrollHeader);

    /*=============== MEGAMENU LOGIC ===============*/
    const header = document.getElementById('header');
    const megamenu = document.querySelector('.megamenu');
    const servicesNavItem = document.querySelector('.nav__item-megamenu');
    const otherNavItems = document.querySelectorAll('.nav__item:not(.nav__item-megamenu)');

    if (header && megamenu && servicesNavItem) {
        servicesNavItem.addEventListener('mouseover', () => {
            megamenu.classList.add('is-visible');
        });
        header.addEventListener('mouseleave', () => {
            megamenu.classList.remove('is-visible');
        });
        header.addEventListener('click', () => {
            megamenu.classList.remove('is-visible');
        });
        otherNavItems.forEach(item => {
            item.addEventListener('mouseover', () => {
                megamenu.classList.remove('is-visible');
            });
        });
    }

    /*=============== MEGAMENU IMAGE CHANGER ===============*/
    const megamenuLinks = document.querySelectorAll('.megamenu__link');
    const megamenuImage = document.getElementById('megamenu-image');

    if (megamenuLinks.length > 0 && megamenuImage) {
        megamenuLinks.forEach(link => {
            link.addEventListener('mouseover', () => {
                const imagePath = link.getAttribute('data-image');
                if (imagePath) {
                    megamenuImage.src = imagePath;
                }
            });
        });
    }

    /*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
    const sections = document.querySelectorAll('section[id]');
    const scrollActive = () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 58;
            const sectionId = current.getAttribute('id');
            const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

            if (sectionsClass) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    sectionsClass.classList.add('active-link');
                } else {
                    sectionsClass.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);
}
