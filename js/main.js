// Fichier: js/main.js
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
        initContactFormAnimation();
    }).catch(error => console.error('Error loading partials:', error));

    // Animation du formulaire de contact
    const initContactFormAnimation = () => {
        const contactForm = document.querySelector('.contact__form');
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault(); // Empêche la soumission standard du formulaire

                const button = this.querySelector('.button');
                const originalButtonText = button.innerHTML;
                button.classList.add('is-sending');
                button.disabled = true;

                // Récupérer les données du formulaire
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch('http://localhost:3000/send-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        throw new Error('La réponse du serveur n\'est pas OK');
                    }

                    // Succès
                    button.innerHTML = 'Envoyé ! <i class="fa fa-check"></i>';
                    contactForm.reset(); // Vider le formulaire

                } catch (error) {
                    console.error('Erreur lors de la soumission du formulaire:', error);
                    button.innerHTML = 'Erreur <i class="fa fa-times"></i>';
                    // Optionnel: afficher un message d'erreur plus visible à l'utilisateur
                } finally {
                    // Après quelques secondes, réinitialiser le bouton
                    setTimeout(() => {
                        button.classList.remove('is-sending');
                        button.innerHTML = originalButtonText;
                        button.disabled = false;
                    }, 4000);
                }
            });
        }
    };

    /*=============== DYNAMIC SERVICES SECTION (SEO FRIENDLY) ===============*/
    const initServicesTabs = () => {
        const servicesSection = document.getElementById('services');
        if (!servicesSection) return;

        const serviceTabs = servicesSection.querySelectorAll('.service-tab__card');
        const serviceDetails = servicesSection.querySelectorAll('.service-details__container');
        const prevBtn = servicesSection.querySelector('#prev-service');
        const nextBtn = servicesSection.querySelector('#next-service');

        const updateActiveService = (serviceId) => {
            // Mettre à jour les onglets
            serviceTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.service === serviceId);
            });

            // Mettre à jour les panneaux de détails
            serviceDetails.forEach(detail => {
                detail.classList.toggle('active', detail.dataset.service === serviceId);
            });
        };

        // Gérer le clic sur les onglets
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                updateActiveService(tab.dataset.service);
            });
        });

        // Gérer les flèches de navigation
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

    // Appeler la nouvelle fonction d'initialisation
    initServicesTabs();
});
