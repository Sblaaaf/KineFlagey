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
    }).catch(error => console.error('Error loading partials:', error));
});
