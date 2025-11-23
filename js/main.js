// Fichier: js/main.js

// Animation du formulaire de contact
const initContactFormAnimation = () => {
    const contactForm = document.querySelector('.contact__form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Empêche la soumission standard du formulaire

        const button = this.querySelector('.button');
        const originalButtonText = button.innerHTML;
        button.classList.add('is-sending');
        button.disabled = true;

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            // Pour la production, cette URL devrait être relative ou provenir d'une variable de configuration
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error(`Server response was not OK: ${response.statusText}`);

            button.innerHTML = 'Envoyé ! <i class="fa fa-check"></i>';
            contactForm.reset();
            // Réinitialiser le custom select visuellement
            const customSelect = contactForm.querySelector('.select-selected');
            if (customSelect) {
                const placeholder = contactForm.querySelector('select option[disabled]').innerHTML;
                customSelect.innerHTML = placeholder;
                customSelect.classList.add("select-placeholder");
            }

        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            button.innerHTML = 'Erreur <i class="fa fa-times"></i>';
        } finally {
            setTimeout(() => {
                button.classList.remove('is-sending');
                button.innerHTML = originalButtonText;
                button.disabled = false;
            }, 4000);
        }
    });
};

/*=============== DYNAMIC SERVICES SECTION (SEO FRIENDLY) ===============*/
const initServicesTabs = () => {
    const servicesSection = document.getElementById('services');
    if (!servicesSection) return;

    const serviceTabs = servicesSection.querySelectorAll('.service-tab__card');
    const serviceDetails = servicesSection.querySelectorAll('.service-details__container');
    const prevBtn = servicesSection.querySelector('#prev-service');
    const nextBtn = servicesSection.querySelector('#next-service');

    if (!prevBtn || !nextBtn || serviceTabs.length === 0) return;

    const updateActiveService = (serviceId) => {
        serviceTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.service === serviceId);
        });

        serviceDetails.forEach(detail => {
            detail.classList.toggle('active', detail.dataset.service === serviceId);
        });
    };

    serviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            updateActiveService(tab.dataset.service);
        });
    });

    const navigateServices = (direction) => {
        const currentActiveTab = servicesSection.querySelector('.service-tab__card.active');
        let currentTabIndex = Array.from(serviceTabs).indexOf(currentActiveTab);
        let nextIndex = (currentTabIndex + direction + serviceTabs.length) % serviceTabs.length;
        const nextServiceId = serviceTabs[nextIndex].dataset.service;
        updateActiveService(nextServiceId);
    };

    prevBtn.addEventListener('click', () => navigateServices(-1));
    nextBtn.addEventListener('click', () => navigateServices(1));
};

/*=============== TECHNIQUES ACCORDION & IMAGE CHANGER ===============*/
const initTechniquesTabs = () => {
    const techniquesSection = document.getElementById('techniques');
    if (!techniquesSection) return;

    const techniqueItems = techniquesSection.querySelectorAll('.techniques__item');
    const mainImage = document.getElementById('technique-main-image');

    if (!mainImage || techniqueItems.length === 0) return;

    techniqueItems.forEach(item => {
        const header = item.querySelector('.techniques__header');
        // On définit la variable CSS pour l'image de fond
        header.style.setProperty('--bg-image', `url(${item.dataset.image})`);

        header.addEventListener('click', () => {
            const wasOpen = item.classList.contains('is-open');

            // On ferme d'abord tous les autres items
            techniquesSection.querySelectorAll('.techniques__item.is-open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('is-open');
                }
            });

            // On bascule l'état de l'item cliqué
            item.classList.toggle('is-open');

            // Si on vient d'ouvrir l'item, on change l'image
            if (!wasOpen) {
                const newImageSrc = item.dataset.image;
                mainImage.classList.add('is-changing');
                setTimeout(() => {
                    mainImage.src = newImageSrc;
                    mainImage.onload = () => mainImage.classList.remove('is-changing');
                }, 200);
            }
            // 
        });
    });
};

/*=============== COMPLEMENTARY SERVICES ACCORDION & IMAGE CHANGER ===============*/
const initComplementaryServicesTabs = () => {
    const section = document.getElementById('complementary-services');
    if (!section) return;

    const items = section.querySelectorAll('.complementary__item');
    const mainImage = document.getElementById('complementary-main-image');

    if (!mainImage || items.length === 0) return;

    items.forEach(item => {
        const header = item.querySelector('.complementary__header');

        header.addEventListener('click', () => {
            const wasOpen = item.classList.contains('is-open');

            section.querySelectorAll('.complementary__item.is-open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('is-open');
                }
            });

            item.classList.toggle('is-open');

            if (!wasOpen) {
                const newImageSrc = item.dataset.image;
                mainImage.classList.add('is-changing');
                setTimeout(() => {
                    mainImage.src = newImageSrc;
                    mainImage.onload = () => mainImage.classList.remove('is-changing');
                }, 200);
            }
        });
    });
};

document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour charger un partial (header, footer)
    const loadPartial = (selector, url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`File not found: ${url}`);
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) element.innerHTML = data;
            });
    };

    // Charger le header et le footer et attendre qu'ils soient chargés
    Promise.all([
        loadPartial("#header-placeholder", "/shared/_header.html"),
        loadPartial("#footer-placeholder", "/shared/_footer.html")
    ]).then(() => {
        // Une fois les partials chargés, on peut lancer les scripts d'initialisation
        initNavigation();
        initComponents();
        initCustomSelect();
        initServicesTabs();
        initTechniquesTabs();
        initComplementaryServicesTabs();
        initContactFormAnimation();
    }).catch(error => console.error('Error loading partials:', error));
});
