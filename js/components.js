// Fichier: js/components.js
function initComponents() {
    /*=============== GENERATION DYNAMIQUE DES LISTES DE PRATICIENS DANS LES SERVICES ===============*/
    const generatePractitionersList = () => {
        // Mappages de spécialités et techniques pour les sections de services
        const serviceMapping = {
            'generale': {
                type: 'specialty',
                values: ['Kiné Générale', 'Kinésithérapie Générale']
            },
            'sportive': {
                type: 'specialty',
                values: ['Kiné Sportive', 'Kinésithérapie Sportive']
            },
            'osteopathie': {
                type: 'specialty',
                values: ['Ostéopathie D.O.']
            },
            'perinatale': {
                type: 'specialty',
                values: ['Kiné Périnatale', 'Kinésithérapie périnatale']
            },
            'perineale': {
                type: 'specialty',
                values: ['Kiné Pelvi-périnéale', 'Rééducation pelvi-périnéale', 'Rééducation Abdomino-pelvienne']
            },
            'atm': {
                type: 'technique',
                values: ['ATM']
            },
            'orthopedie': {
                type: 'specialty',
                values: ['Orthopédie', 'Orthopédie & Traumatologie', 'Thérapie manuelle orthopédique']
            },
            'viscerale': {
                type: 'specialty',
                values: ['Kiné Viscérale', 'Kinésithérapie viscérale']
            }
        };

        // Parcourir chaque section de service
        Object.entries(serviceMapping).forEach(([service, config]) => {
            const serviceContainer = document.querySelector(`.service-details__container[data-service="${service}"]`);
            if (!serviceContainer) return;

            const practitionersList = serviceContainer.querySelector('.practitioners__list');
            if (!practitionersList) return;

            // Vider la liste actuelle
            practitionersList.innerHTML = '';

            // Trouver tous les praticiens correspondants
            const matchingPractitioners = [];
            Object.entries(teamMembers).forEach(([id, member]) => {
                let hasMatch = false;

                if (config.type === 'specialty') {
                    hasMatch = member.specialties && member.specialties.some(specialty =>
                        config.values.some(val => val.toLowerCase() === specialty.toLowerCase())
                    );
                } else if (config.type === 'technique') {
                    hasMatch = member.techniques && member.techniques.some(technique =>
                        config.values.some(val => val.toLowerCase() === technique.toLowerCase())
                    );
                }

                if (hasMatch) {
                    matchingPractitioners.push({ id, member });
                }
            });

            // Générer les éléments HTML
            matchingPractitioners.forEach(({ id, member }) => {
                const link = document.createElement('a');
                link.href = '#';
                link.classList.add('team__card--link');
                link.setAttribute('data-member-id', id);
                link.innerHTML = `<img src="${member.photo}" alt="${member.firstName} ${member.lastName}" class="team__img-mini">`;
                practitionersList.appendChild(link);
            });
        });
    };

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
    // Générer les listes de praticiens dans les services
    generatePractitionersList();

    const teamCards = document.querySelectorAll('.team__card');
    let practitionerLinks = document.querySelectorAll('.team__card--link');
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
                    <div class="practitioner-modal__section practitioner-modal__accordion">
                        <h4 class="practitioner-modal__section-title practitioner-modal__accordion-toggle" role="button" tabindex="0">À propos <i class="fa-solid fa-chevron-down"></i></h4>
                        <div class="practitioner-modal__accordion-content">
                            <p class="practitioner-modal__description">${memberData.description}</p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="practitioner-modal__section">
                        <h4 class="practitioner-modal__section-title">Contacts</h4>
                        <div class="practitioner-modal__actions">
                            ${memberData.contact.phone ? `<a href="tel:${memberData.contact.phone}" class="button outline-secondary"><i class="fa-solid fa-phone"></i> ${memberData.contact.phone}</a>` : ''}
                            ${memberData.contact.email ? `<a href="mailto:${memberData.contact.email}" class="button outline-primary"><i class="fa-solid fa-envelope"></i> Email</a>` : ''}
                            ${memberData.contact.phone ? `<a href="https://wa.me/${memberData.contact.phone.replace(/[^0-9]/g, '')}" target="_blank" class="button whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ''}
                            ${memberData.contact.rosaLink ? `<a href="${memberData.contact.rosaLink}" target="_blank" class="button button--rosa">Rosa.be <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                        </div>
                        ${memberData.contact.contactNote ? `<p class="practitioner-modal__contact-note">${memberData.contact.contactNote}</p>` : ''}
                    </div>

            `;
            teamModal.classList.add('is-open');
            modalPrevBtn.style.display = showNav ? 'block' : 'none';
            modalNextBtn.style.display = showNav ? 'block' : 'none';
            
            // Initialiser les accordions de la modal
            const accordions = teamModalContent.querySelectorAll('.practitioner-modal__accordion-toggle');
            accordions.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    const accordion = toggle.closest('.practitioner-modal__accordion');
                    accordion.classList.toggle('is-open');
                });
                toggle.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle.click();
                    }
                });
            });
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

        // Re-requêter les liens des praticiens après génération dynamique
        practitionerLinks = document.querySelectorAll('.team__card--link');
        
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

        // Fonction pour afficher tous les praticiens
        const showAllPractitioners = () => {
            teamCards.forEach(card => {
                card.style.display = 'block';
            });
            noResultsMessage.style.display = 'none';
        };

        // Gère le clic sur les onglets (Spécialité / Technique)
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetTab = tab.dataset.tab;

                filtersContents.forEach(content => {
                    content.classList.toggle('active', content.dataset.tabContent === targetTab);
                });

                // Réinitialiser les filtres à "Tous" quand on change d'onglet
                const newActiveGroup = document.querySelector('.team__filters[data-tab-content="' + targetTab + '"]');
                if (newActiveGroup) {
                    // Désactiver tous les boutons
                    newActiveGroup.querySelectorAll('.team__filter').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    // Activer le bouton "Tous"
                    const allButton = newActiveGroup.querySelector('.team__filter[data-filter="all"]');
                    if (allButton) {
                        allButton.classList.add('active');
                    }
                    // Afficher tous les praticiens
                    showAllPractitioners();
                }
            });
        });

        // Mappages de normalisation pour les spécialités et techniques
        const specialtyMapping = {
            'kine-generale': ['Kiné Générale', 'Kinésithérapie Générale', 'Kiné générale'],
            'kine-sportive': ['Kiné Sportive', 'Kinésithérapie Sportive'],
            'osteopathie-do': ['Ostéopathie D.O.'],
            'kine-perinatale': ['Kiné Périnatale', 'Kinésithérapie périnatale', 'Kinésithérapie pré/post-natale'],
            'kine-pelvi-perineale': ['Kiné Pelvi-périnéale', 'Rééducation pelvi-périnéale', 'Rééducation Pelvi-périnéale', 'Rééducation Abdomino-pelvienne'],
            'orthopedie': ['Orthopédie', 'Orthopédie & Traumatologie', 'Thérapie manuelle orthopédique', 'Pré/post-opératoire', 'Thérapie maxillo-faciale'],
            'kine-viscerale': ['Kiné Viscérale', 'Kinésithérapie viscérale', 'Kinésithérapie viscerale', 'Rééducation abdominale']
        };

        // Whitelist des praticiens autorisés pour chaque filtre de spécialité
        const specialtyFilters = {
            'kine-generale': [1, 2, 8, 7, 6, 5], // Gilles, Maria, Marie, Thomas, Mathilde, Simon
            'kine-sportive': [1, 8, 5], // Gilles, Marie, Simon
            'orthopedie': [1, 8, 5], // Gilles, Marie, Simon (Ortho/Trauma)
            'kine-perinatale': [2, 4, 6], // Maria, Fanny, Mathilde
            'kine-pelvi-perineale': [6], // Mathilde (Fanny seulement en Périnatale)
            'atm': [2, 4, 8], // Maria, Fanny, Marie
            'osteopathie-do': [1, 5], // Gilles, Simon
            'kine-viscerale': [4] // Fanny
        };

        const techniqueMapping = {
            'therapie-manuelle': ['Thérapie manuelle', 'Thérapie manuelle orthopédique', 'Gestion de la douleur', 'Gestion de douleur'],
            'dry-needling': ['Dry Needling'],
            'analyse-course': ['Analyse de la course', 'Clinique du coureur', 'Prévention des blessures du coureur'],
            'ondes-choc': ['Ondes de choc'],
            'methode-mckenzie': ['Méthode McKenzie'],
            'myofasciale': ['Myofasciale', 'Techniques myofasciales', 'Techniques myo-faciales', 'Crochetage', 'Thérapie maxilo-fasciale', 'Thérapie maxillo-faciale'],
            'biofeedback': ['Biofeedback'],
            'neurodynamique': ['Neurodynamique', 'Mobilisations neurodynamiques'],
            'atm': ['ATM'],
            'pilates': ['Pilates', 'Renforcement musculaire', 'Renforcement musculaire ciblé'],
            'nutritherapie': ['Nutrithérapie']
        };

        // Fonction pour vérifier si une valeur correspond à un filtre
        const matchesFilter = (value, mapping) => {
            return mapping.some(item => item.toLowerCase() === value.toLowerCase());
        };

        // Gère le clic sur les boutons de filtre et le filtrage des cartes
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Gérer l'état actif du bouton de filtre
                const group = button.closest('.team__filters');
                if (group) {
                    group.querySelector('.team__filter.active').classList.remove('active');
                }
                button.classList.add('active');

                // 2. Filtrer les cartes en fonction des données de data.js
                let visibleCount = 0;
                
                // Déterminer quel onglet est actif
                const activeTab = document.querySelector('.team__tab.active');
                const activeTabName = activeTab ? activeTab.dataset.tab : 'specialty';
                
                teamCards.forEach(card => {
                    const memberId = card.dataset.memberId;
                    const member = teamMembers[memberId];
                    
                    if (!member) return;
                    
                    let isVisible = true;
                    
                    // Appliquer le filtre SEULEMENT de l'onglet actif
                    if (activeTabName === 'specialty') {
                        const specialtyFilter = document.querySelector('.team__filters[data-tab-content="specialty"] .team__filter.active');
                        if (specialtyFilter && specialtyFilter.dataset.filter !== 'all') {
                            const filterKey = specialtyFilter.dataset.filter;
                            // Utiliser la whitelist des praticiens autorisés
                            const allowedMembers = specialtyFilters[filterKey] || [];
                            isVisible = allowedMembers.includes(parseInt(memberId));
                        }
                    } else if (activeTabName === 'technique') {
                        const techniqueFilter = document.querySelector('.team__filters[data-tab-content="technique"] .team__filter.active');
                        if (techniqueFilter && techniqueFilter.dataset.filter !== 'all') {
                            const filterKey = techniqueFilter.dataset.filter;
                            const expectedValues = techniqueMapping[filterKey] || [];
                            const hasMatch = member.techniques.some(technique => 
                                expectedValues.some(expected => expected.toLowerCase() === technique.toLowerCase())
                            );
                            isVisible = isVisible && hasMatch;
                        }
                    }
                    
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

    const renderSpecialties = () => {
        // Définir les spécialités autorisées à partir du specialtyMapping des filtres
        const specialtyMapping = {
            'kine-generale': ['Kiné Générale', 'Kinésithérapie Générale', 'Kiné générale'],
            'kine-sportive': ['Kiné Sportive', 'Kinésithérapie Sportive'],
            'osteopathie-do': ['Ostéopathie D.O.'],
            'kine-perinatale': ['Kiné Périnatale', 'Kinésithérapie périnatale', 'Kinésithérapie pré/post-natale'],
            'kine-pelvi-perineale': ['Kiné Pelvi-périnéale', 'Rééducation pelvi-périnéale', 'Rééducation Pelvi-périnéale', 'Rééducation Abdomino-pelvienne'],
            'orthopedie': ['Orthopédie', 'Orthopédie & Traumatologie', 'Thérapie manuelle orthopédique', 'Pré/post-opératoire', 'Thérapie maxillo-faciale'],
            'kine-viscerale': ['Kiné Viscérale', 'Kinésithérapie viscérale', 'Kinésithérapie viscerale', 'Rééducation abdominale']
        };

        // Extraire toutes les valeurs autorisées à partir du mapping
        const allowedSpecialties = Object.values(specialtyMapping).flat();

        // Fonction pour vérifier si une valeur correspond à une spécialité autorisée
        const isAllowedSpecialty = (value) => {
            return allowedSpecialties.some(allowed => allowed.toLowerCase() === value.toLowerCase());
        };

        // Récupérer uniquement les spécialités autorisées de tous les praticiens
        const allSpecialties = [...new Set(
            Object.values(teamMembers)
                .flatMap(m => m.specialties || [])
                .filter(specialty => isAllowedSpecialty(specialty))
        )];

        // Map pour lier les spécialités aux icônes et aux ancres de la page
        const specialtyDetails = {
            'Kinésithérapie Générale': { icon: 'generale', anchor: '#services' },
            'Kiné Générale': { icon: 'generale', anchor: '#services' },
            'Kiné générale': { icon: 'generale', anchor: '#services' },
            'Kinésithérapie Sportive': { icon: 'sport', anchor: '#service-kine-sportive' },
            'Kiné Sportive': { icon: 'sport', anchor: '#service-kine-sportive' },
            'Ostéopathie D.O.': { icon: 'osteo', anchor: '#osteopathie' },
            'Kiné Périnatale': { icon: 'perinatale', anchor: '#service-perinatale' },
            'Kinésithérapie périnatale': { icon: 'perinatale', anchor: '#service-perinatale' },
            'Kinésithérapie pré/post-natale': { icon: 'perinatale', anchor: '#service-perinatale' },
            'Kiné Pelvi-périnéale': { icon: 'perineale', anchor: '#service-perineale' },
            'Rééducation pelvi-périnéale': { icon: 'perineale', anchor: '#service-perineale' },
            'Rééducation Pelvi-périnéale': { icon: 'perineale', anchor: '#service-perineale' },
            'Orthopédie': { icon: 'orthopedie', anchor: '#service-orthopedie' },
            'Orthopédie & Traumatologie': { icon: 'orthopedie', anchor: '#service-orthopedie' },
            'Thérapie manuelle orthopédique': { icon: 'orthopedie', anchor: '#service-orthopedie' },
            'Pré/post-opératoire': { icon: 'orthopedie', anchor: '#service-orthopedie' },
            'Thérapie maxillo-faciale': { icon: 'orthopedie', anchor: '#service-orthopedie' },
            'Kiné Viscérale': { icon: 'viscerale', anchor: '#service-viscerale' },
            'Kinésithérapie viscérale': { icon: 'viscerale', anchor: '#service-viscerale' },
            'Kinésithérapie viscerale': { icon: 'viscerale', anchor: '#service-viscerale' },
            'Rééducation abdominale': { icon: 'viscerale', anchor: '#service-viscerale' },
            'Rééducation Abdomino-pelvienne': { icon: 'viscerale', anchor: '#service-viscerale' }
        };

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
            <p class="modal__note">Pour faciliter la prise de rendez-vous par GMS, privilégiez les SMS.</p>
            <div id="practitioner-suggestion">`;

        practitioners.forEach(member => {
            let actionsHTML = `<div class="practitioner-suggestion__actions">`;
            
            // Ajouter les liens selon les données disponibles
            if (member.contact.phone) {
                actionsHTML += `<a href="tel:${member.contact.phone}" class="button button--small outline-secondary" title="Appeler"><i class="fa-solid fa-phone"></i></a>`;
            }
            if (member.contact.email) {
                actionsHTML += `<a href="mailto:${member.contact.email}" class="button button--small outline-primary" title="Envoyer un email"><i class="fa-solid fa-envelope"></i></a>`;
            }
            if (member.contact.phone) {
                actionsHTML += `<a href="https://wa.me/${member.contact.phone.replace(/[^0-9]/g, '')}" target="_blank" class="button button--small whatsapp" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;
            }
            if (member.contact.rosaLink) {
                actionsHTML += `<a href="${member.contact.rosaLink}" target="_blank" class="button button--small button--rosa" title="Prendre rendez-vous sur Rosa.be"><svg class="rosa-icon"><use href="/assets/svg/sprite.svg#rosa"></use></svg></a>`;
            }
            actionsHTML += `</div>`;

            content += `
                <div class="practitioner-suggestion__item">
                    <div class="practitioner-suggestion__info">
                        <img src="${member.photo}" alt="${member.firstName} ${member.lastName}" class="practitioner-suggestion__avatar">
                        <strong>${member.firstName} ${member.lastName}</strong>
                    </div>
                    ${actionsHTML}
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
            const target = e.target.closest('a');
            if (!target) return;

            // Empêcher le comportement par défaut UNIQUEMENT pour les liens de navigation
            if (target.matches('.modal__option') || target.id === 'back-to-specialties' || target.id === 'back-to-specialties-step') {
                e.preventDefault();
                
                if (target.matches('.modal__option')) {
                    const specialty = target.dataset.specialty;
                    renderPractitioners(specialty);
                } else if (target.id === 'back-to-specialties' || target.id === 'back-to-specialties-step') {
                    renderSpecialties();
                }
            }
            // Les autres liens (tel:, mailto:, WhatsApp, Rosa.be) fonctionnent normalement
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
        item.classList.toggle('is-open');
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
