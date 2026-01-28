// Fichier: js/components.js
function initComponents() {
    /*=============== GESTION DES MODALS (POPUPS) ===============*/
    const bookingModal = document.getElementById('booking-modal');
    const openBookingModalBtns = document.querySelectorAll('.open-booking-modal');

    if (bookingModal && openBookingModalBtns.length > 0) {
        openBookingModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                bookingModal.classList.add('is-open');
            });
        });
    }

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal__close')) {
                modal.classList.remove('is-open');
            }
        });
    });

    /*=============== FILTRAGE DE L'ÉQUIPE & MODAL DÉTAILS ===============*/
    const teamCards = document.querySelectorAll('.team__card');
    const practitionerLinks = document.querySelectorAll('.team__card--link');
    const teamModal = document.getElementById('team-modal');
    const teamModalContent = document.getElementById('team-modal-content');
    const modalPrevBtn = document.getElementById('modal-prev');
    const modalNextBtn = document.getElementById('modal-next');
    let currentPractitionerIndex = 0;
    let visiblePractitioners = [];

    const showPractitionerModal = (memberId, showNav = true) => {
        const memberData = teamMembers[memberId];
        if (memberData && teamModalContent) {
            // Fonctions utilitaires pour générer les listes de badges
            const createBadges = (items) => {
                if (!items || items.length === 0) return '';
                return items.map(item => `<span class="practitioner-modal__badge">${item}</span>`).join('');
            };

            const languages = memberData.languages ? memberData.languages.join(', ') : '';

            teamModalContent.innerHTML = `
                <i class="fa-solid fa-xmark modal__close"></i>
                <div class="practitioner-modal__header">
                    <img src="${memberData.photo}" alt="${memberData.firstName} <span>${memberData.lastName}</span>" class="practitioner-modal__photo">
                    <div class="practitioner-modal__header-info">
                        <h3 class="practitioner-modal__name">${memberData.firstName} ${memberData.lastName}</h3>
                        <div class="practitioner-modal__meta">
                            ${memberData.inami ? `<span><i class="fa-solid fa-id-card"></i> INAMI : ${memberData.inami}</span>` : ''}
                            ${memberData.convention ? `<span><i class="fa-solid fa-file-signature"></i> ${memberData.convention}</span>` : ''}
                            ${languages ? `<span><i class="fa-solid fa-language"></i> ${languages}</span>` : ''}
                        </div>
                    </div>
                </div>

                <div class="practitioner-modal__body">
                    ${memberData.specialties && memberData.specialties.length > 0 ? `
                    <div class="practitioner-modal__section">
                        <h4 class="practitioner-modal__section-title">Spécialités</h4>
                        <div class="practitioner-modal__badges">${createBadges(memberData.specialties)}</div>
                    </div>` : ''}

                    ${memberData.techniques && memberData.techniques.length > 0 ? `
                    <div class="practitioner-modal__section">
                        <h4 class="practitioner-modal__section-title">Techniques</h4>
                        <div class="practitioner-modal__badges">${createBadges(memberData.techniques)}</div>
                    </div>
                    ` : ''}
                    
                    ${memberData.description ? `
                    <div class="practitioner-modal__section">
                        <h4 class="practitioner-modal__section-title">À propos</h4>
                        <p class="practitioner-modal__description">${memberData.description}</p>
                    </div>
                    ` : ''}
                    
                    <div class="practitioner-modal__section">
                        <h4 class="practitioner-modal__section-title">Contacts</h4>
                        <div class="practitioner-modal__actions">
                            ${memberData.contact.phone ? `<a href="tel:${memberData.contact.phone}" class="button outline-secondary"><i class="fa-solid fa-phone"></i> ${memberData.contact.phone}</a>` : ''}
                            <a href="${memberData.contact.rosaLink}" target="_blank" class="button button--rosa">Rosa.be <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                            <a href="${memberData.contact.rosaLink}" target="_blank" class="button"><i class="fa-solid fa-calendar-check"></i> Prendre rendez-vous</a>
                        </div>
                    </div>
                </div>

            `;
            teamModal.classList.add('is-open');
            modalPrevBtn.style.display = showNav ? 'block' : 'none';
            modalNextBtn.style.display = showNav ? 'block' : 'none';
        }
    }

    if (teamCards.length > 0) {
        teamCards.forEach(card => {
            card.addEventListener('click', () => {
                const memberId = card.getAttribute('data-member-id');
                visiblePractitioners = Array.from(document.querySelectorAll('.team__card:not([style*="display: none"])'))
                    .map(c => c.getAttribute('data-member-id'));
                currentPractitionerIndex = visiblePractitioners.indexOf(memberId);
                showPractitionerModal(memberId);
            });
        });

        // Ajout pour les liens des praticiens dans la section services
        practitionerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const memberId = link.getAttribute('data-member-id');
                // On n'active pas la navigation prev/next depuis cette vue
                showPractitionerModal(memberId, false);
            });
        });

        const tabs = document.querySelectorAll('.team__tab');
        const filtersContents = document.querySelectorAll('.team__filters');
        const filterButtons = document.querySelectorAll('.team__filter');
        const noResultsMessage = document.querySelector('.team__no-results');

        // Gère le clic sur les onglets (Spécialité / Technique)
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetTab = tab.dataset.tab;

                filtersContents.forEach(content => {
                    content.classList.toggle('active', content.dataset.tabContent === targetTab);
                });
            });
        });

        // Gère le clic sur les boutons de filtre et le filtrage des cartes
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Gérer l'état actif du bouton de filtre
                const group = button.closest('.team__filters');
                if (group) {
                    group.querySelector('.team__filter.active').classList.remove('active');
                }
                button.classList.add('active');

                // 2. Filtrer les cartes
                const filter = button.dataset.filter;
                let visibleCount = 0;
                teamCards.forEach(card => {
                    const specialties = card.dataset.specialty;
                    const isVisible = (filter === 'all' || specialties.includes(filter));
                    card.style.display = isVisible ? 'block' : 'none';
                    if (isVisible) {
                        visibleCount++;
                    }
                });

                // 3. Afficher ou cacher le message "aucun résultat"
                noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
            });
        });
    }

    if(modalNextBtn) modalNextBtn.addEventListener('click', () => {
        currentPractitionerIndex = (currentPractitionerIndex + 1) % visiblePractitioners.length;
        showPractitionerModal(visiblePractitioners[currentPractitionerIndex]);
    });

    if(modalPrevBtn) modalPrevBtn.addEventListener('click', () => {
        currentPractitionerIndex = (currentPractitionerIndex - 1 + visiblePractitioners.length) % visiblePractitioners.length;
        showPractitionerModal(visiblePractitioners[currentPractitionerIndex]);
    });

    /*=============== PARCOURS DE PRISE DE RDV GUIDÉ ===============*/
    /* const bookingOptions = document.querySelectorAll('.modal__option');
    const suggestionContainer = document.getElementById('practitioner-suggestion');
    if (bookingOptions.length > 0) {
        bookingOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const practitionerIds = e.target.getAttribute('data-practitioner-ids').split(',');
                suggestionContainer.innerHTML = '<h4>Praticien(s) recommandé(s) :</h4>';
                practitionerIds.forEach(id => {
                    const member = teamMembers[id.trim()];
                    if (member) {
                        suggestionContainer.innerHTML += `
                            <div class="practitioner-suggestion__item">
                                <div><strong>${member.name}</strong><p class="team__specialty">${member.specialties}</p></div>
                                <a href="${member.contact.rosaLink}" target="_blank" class="button button--small">Prendre RDV</a>
                            </div>`;
                    }
                });
            });
        });
    } */

    const bookingModalContent = document.querySelector('#booking-modal .modal__content');

    // Map pour lier les spécialités aux icônes et aux ancres de la page
    const specialtyDetails = {
        'Kinésithérapie Générale': { icon: 'generale', anchor: '#services' },
        'Kinésithérapie Sportive': { icon: 'sport', anchor: '#service-kine-sportive' },
        'Ostéopathie D.O.': { icon: 'osteo', anchor: '#osteopathie' },
        'Uro-gynécologie': { icon: 'perinatale', anchor: '#service-perineale' },
        'périnéale': { icon: 'perinatale', anchor: '#service-perineale' },
        'ATM': { icon: 'atm', anchor: '#service-maxillo-faciale' },
        'Thérapie manuelle': { icon: 'generale', anchor: '#techniques' },
        'Analyse de la course': { icon: 'sport', anchor: '#techniques' },
        // Ajoutez d'autres mappages si nécessaire
    };

    const renderSpecialties = () => {
        const allSpecialties = [...new Set(Object.values(teamMembers).flatMap(m => m.specialties || []))];
        let content = `
            <div class="modal__header-steps">
                <span class="modal__step active" data-step="1">Spécialité</span>
                <span class="modal__step-separator">&gt;</span>
                <span class="modal__step" data-step="2">Praticien</span>
            </div>
            <h3 class="modal__title">Quel est le motif de votre consultation ?</h3>
            <i class="fa-solid fa-xmark modal__close"></i>
            <div class="modal__options" id="specialty-options">`;

        allSpecialties.forEach(specialty => {
            const details = specialtyDetails[specialty] || { icon: 'generale', anchor: '#services' };
            content += `
                <div class="modal__option-item">
                    <a href="#" class="modal__option" data-specialty="${specialty}">
                        <svg class="modal__option-icon"><use href="/assets/svg/sprite.svg#${details.icon}"></use></svg>
                        <span>${specialty}</span>
                    </a>
                    <a href="${details.anchor}" class="modal__option-info" data-close-modal="true"><i class="fa-solid fa-circle-info"></i></a>
                </div>`;
        });
        content += `</div>`;
        bookingModalContent.innerHTML = content;
    };

    const renderPractitioners = (specialty) => {
        const practitioners = Object.values(teamMembers).filter(m => m.specialties && m.specialties.map(s => s.trim()).includes(specialty.trim()));
        let content = `
            <div class="modal__header-steps">
                <a href="#" class="modal__step" id="back-to-specialties-step" data-step="1">Spécialité</a>
                <span class="modal__step-separator">&gt;</span>
                <span class="modal__step active" data-step="2">Praticien</span>
            </div>
            <i class="fa-solid fa-xmark modal__close"></i>
            <h3 class="modal__title"><i class="fa-solid fa-arrow-right" style="color:var(--primary);"></i> ${specialty}</h3>
            <p class="modal__description">Praticiens recommandés :</p>
            <div id="practitioner-suggestion">`;

        practitioners.forEach(member => {
            content += `
                <div class="practitioner-suggestion__item">
                    <div class="practitioner-suggestion__info">
                        <img src="${member.photo}" alt="${member.firstName} <span>${member.lastName}</span>" class="practitioner-suggestion__avatar">
                        <strong>${member.firstName} ${member.lastName}</strong>
                    </div>
                    <div class="practitioner-suggestion__actions">
                        <a href="${member.contact.rosaLink}" target="_blank" class="button button--small"><i class="fa-solid fa-calendar-check"></i></a>
                        <a href="tel:${member.contact.phone}" class="button button--small outline-secondary"><i class="fa-solid fa-phone"></i></a>
                        <a href="${member.contact.rosaLink}" target="_blank" class="button button--small button--rosa">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" class="rosa-icon">
                                <path d="M62.91,90.67h0l-13.32-29.43c-3.54-7.77-1.94-16.03,4.44-21.1h0c1.67-1.32,2.5-2.5,2.91-4.23.49-1.94.56-4.65.49-9.16-.07-5.55-4.44-9.79-9.92-9.79s-9.92,4.37-9.92,9.72v61.91c0,3.05-2.5,5.41-5.48,5.41s-5.48-2.43-5.48-5.41V26.54c-.14-11.38,9.3-20.54,20.82-20.54s20.82,9.02,20.96,20.54c.07,4.51.07,8.61-.9,12.21-.97,3.75-2.98,6.94-6.59,9.85h0c-.42.35-1.32,1.18-1.8,2.5-.49,1.25-.69,3.12.49,5.83l13.32,29.43c1.25,2.78,0,5.97-2.85,7.15h0c-.69.28-1.39.42-2.15.42-2.08-.07-4.09-1.25-5-3.26h0Z"/>
                            </svg>
                        </a>
                    </div>
                </div>`;
        });
        content += `</div>`;
        content += `<a href="#" class="modal__back-link" id="back-to-specialties"><i class="fa-solid fa-arrow-left"></i> Retour aux spécialités</a>`;
        bookingModalContent.innerHTML = content;
    };

    const resetBookingModal = () => {
        if (bookingModalContent) {
            renderSpecialties();
        }
    };

    if (bookingModalContent) {
        // Initial render
        renderSpecialties();

        // Event delegation for dynamic content
        bookingModalContent.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.closest('a');
            if (!target) return;

            if (target.matches('.modal__option')) {
                const specialty = target.dataset.specialty;
                renderPractitioners(specialty);
            } else if (target.id === 'back-to-specialties' || target.id === 'back-to-specialties-step') {
                renderSpecialties();
            }
        });
    }
    
    // Reset modal on close
    if (bookingModal) {
        const observer = new MutationObserver((mutations) => {
            if (!bookingModal.classList.contains('is-open') && mutations[0].oldValue.includes('is-open')) {
                resetBookingModal();
            }
        });
        observer.observe(bookingModal, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    /*=============== FAQ ACCORDION ===============*/
    const faqItems = document.querySelectorAll('.faq__item');
    const techniquesItems = document.querySelectorAll('.techniques__item');
    const complementaryItems = document.querySelectorAll('.complementary__item');

    faqItems.forEach((item) => {
        const faqHeader = item.querySelector('.faq__header');

        faqHeader.addEventListener('click', () => {
            const openItem = document.querySelector('.faq-open');

            // Ferme l'élément déjà ouvert s'il est différent de celui cliqué
            if (openItem && openItem !== item) {
                toggleItem(openItem);
            }

            // Ouvre ou ferme l'élément cliqué
            toggleItem(item);
        });
    });

    const toggleItem = (item) => {
        const faqContent = item.querySelector('.faq__content');

        if (item.classList.contains('faq-open')) {
            faqContent.style.maxHeight = null;
            item.classList.remove('faq-open');
        } else {
            // Calcule la hauteur nécessaire pour le contenu
            faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
            item.classList.add('faq-open');
        }
    };

    const setupAccordion = (items) => {
        items.forEach((item) => {
            const header = item.querySelector('.complementary__header');
            if (header) { // Vérification pour éviter les erreurs
                header.addEventListener('click', () => {
                const openItem = item.parentElement.querySelector('.is-open');
                if (openItem && openItem !== item) {
                    toggleAccordionItem(openItem);
                }
                toggleAccordionItem(item);
            });
            }
        });
    };

    const toggleAccordionItem = (item) => {
        const content = item.querySelector('.complementary__content');
        item.classList.toggle('is-open');
        content.style.maxHeight = item.classList.contains('is-open') ? content.scrollHeight + 'px' : null;
    };
    setupAccordion(complementaryItems);

    // Logique pour les raccourcis des techniques
    const techniqueTabs = document.querySelectorAll('.technique-tab__card');
    const techniqueDetails = document.querySelectorAll('.techniques__details-content');
    const techniqueImages = document.querySelectorAll('.techniques__details-image');

    techniqueTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Gérer l'état actif des onglets
            document.querySelector('.technique-tab__card.active').classList.remove('active');
            tab.classList.add('active');

            // Gérer l'affichage du contenu et de l'image
            const targetTechnique = tab.dataset.technique;
            techniqueDetails.forEach(detail => {
                detail.classList.toggle('active', detail.dataset.technique === targetTechnique);
            });
            techniqueImages.forEach(image => {
                image.classList.toggle('active', image.dataset.technique === targetTechnique);
            });
        });
    });

    /*=============== SWIPER JS ===============*/
    if (document.querySelector(".cabinet-swiper")) {
        new Swiper(".cabinet-swiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
            },
        });

        // Logique pour la galerie modale du cabinet
        const galleryModal = document.getElementById('gallery-modal');
        const galleryImages = document.querySelectorAll('.cabinet__gallery-img');
        const modalImage = document.getElementById('gallery-modal-image');
        const closeGalleryModalBtn = document.getElementById('close-gallery-modal');
        const galleryPrevBtn = document.getElementById('gallery-prev');
        const galleryNextBtn = document.getElementById('gallery-next');
        let currentImageIndex;

        const openGalleryModal = (index) => {
            currentImageIndex = index;
            modalImage.src = galleryImages[currentImageIndex].src;
            galleryModal.classList.add('is-open');
            galleryPrevBtn.style.display = 'block';
            galleryNextBtn.style.display = 'block';
        };

        const closeGalleryModal = () => galleryModal.classList.remove('is-open');

        galleryImages.forEach((img, index) => img.addEventListener('click', () => openGalleryModal(index)));
        closeGalleryModalBtn.addEventListener('click', closeGalleryModal);
        galleryModal.addEventListener('click', (e) => e.target === galleryModal && closeGalleryModal());
        galleryNextBtn.addEventListener('click', () => openGalleryModal((currentImageIndex + 1) % galleryImages.length));
        galleryPrevBtn.addEventListener('click', () => openGalleryModal((currentImageIndex - 1 + galleryImages.length) % galleryImages.length));

        // Cacher les flèches de la modale galerie à la fermeture
        new MutationObserver(() => !galleryModal.classList.contains('is-open') && (galleryPrevBtn.style.display = 'none', galleryNextBtn.style.display = 'none')).observe(galleryModal, { attributes: true, attributeFilter: ['class'] });
    }
    if (document.querySelector(".hero-swiper")) {
        new Swiper(".hero-swiper", { spaceBetween: 30, loop: true, effect: 'fade', autoplay: { delay: 4000, disableOnInteraction: false } });
    }
    if (document.querySelector(".other-services-swiper")) {
        new Swiper(".other-services-swiper", { spaceBetween: 30, slidesPerView: 1, loop: true, pagination: { el: ".swiper-pagination", clickable: true }, breakpoints: { 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 } } });
    }

    /*=============== SCROLL UP ===============*/
    const scrollUp = () => {
        const scrollUpBtn = document.getElementById('scroll-up');
        if (scrollUpBtn) {
            window.scrollY >= 350 ? scrollUpBtn.classList.add('show-scroll') : scrollUpBtn.classList.remove('show-scroll');
        }
    }
    window.addEventListener('scroll', scrollUp);
}

/*=============== CUSTOM SELECT ===============*/
function initCustomSelect() {
    const customSelects = document.querySelectorAll(".custom-select");

    customSelects.forEach(selElm => {
        const select = selElm.getElementsByTagName("select")[0];
        if (!select) return;

        // Crée l'élément qui affichera la valeur sélectionnée
        const selectedDiv = document.createElement("DIV");
        selectedDiv.setAttribute("class", "select-selected");
        selectedDiv.innerHTML = select.options[select.selectedIndex].innerHTML;
        selElm.appendChild(selectedDiv);

        // Crée le conteneur pour les options
        const optionsDiv = document.createElement("DIV");
        optionsDiv.setAttribute("class", "select-items select-hide");

        // Crée et ajoute chaque option
        Array.from(select.options).forEach((option, j) => {
            if (option.disabled) return; // Ne pas créer d'option pour le placeholder
            const optionDiv = document.createElement("DIV");
            optionDiv.innerHTML = option.innerHTML;

            optionDiv.addEventListener("click", function(e) {
                // Met à jour le select original
                select.selectedIndex = j;
                // Met à jour l'affichage
                selectedDiv.innerHTML = this.innerHTML;
                selectedDiv.classList.remove("select-placeholder");
                // Ferme la liste
                closeAllSelects();
            });
            optionsDiv.appendChild(optionDiv);
        });
        selElm.appendChild(optionsDiv);

        // Gère l'ouverture/fermeture
        selectedDiv.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelects(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    });

    function closeAllSelects(elmnt) {
        const selectItems = document.getElementsByClassName("select-items");
        const selectSelected = document.getElementsByClassName("select-selected");

        for (let i = 0; i < selectSelected.length; i++) {
            if (elmnt !== selectSelected[i]) {
                selectSelected[i].classList.remove("select-arrow-active");
            }
        }
        for (let i = 0; i < selectItems.length; i++) {
            if (elmnt === null || (elmnt && selectItems[i].previousSibling !== elmnt)) {
                 selectItems[i].classList.add("select-hide");
            }
        }
    }

    // Ferme les listes si on clique ailleurs
    document.addEventListener("click", closeAllSelects);
}
