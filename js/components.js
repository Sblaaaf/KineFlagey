// Fichier: js/components.js
function initComponents() {
    /*=============== GESTION DES MODALS (POPUPS) ===============*/
    const bookingModal = document.getElementById('booking-modal');
    const teamModal = document.getElementById('team-modal');
    const openBookingModalBtn = document.getElementById('open-booking-modal');

    if (openBookingModalBtn) {
        openBookingModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.classList.add('is-open');
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
    const teamModalContent = document.getElementById('team-modal-content');
    const modalPrevBtn = document.getElementById('modal-prev');
    const modalNextBtn = document.getElementById('modal-next');
    let currentPractitionerIndex = 0;
    let visiblePractitioners = [];

    const showPractitionerModal = (memberId) => {
        const memberData = teamMembers[memberId];
        if (memberData && teamModalContent) {
            teamModalContent.innerHTML = `
                <i class="fa-solid fa-xmark modal__close"></i>
                <img src="${memberData.photo}" alt="Photo de ${memberData.name}" class="team__img-modal">
                <h3 class="modal__title">${memberData.name}</h3>
                <p class="team__specialty">${memberData.specialties}</p>
                <p>${memberData.description}</p>
                <div class="team__contact-modal">
                    <h4>Contact & RDV :</h4>
                    <p><strong>Email:</strong> <a href="mailto:${memberData.contact.email}">${memberData.contact.email}</a></p>
                    <p><strong>Téléphone:</strong> <a href="tel:${memberData.contact.phone}">${memberData.contact.phone}</a></p>
                    <a href="${memberData.contact.rosaLink}" target="_blank" class="button">Prendre RDV via Rosa.be</a>
                </div>
            `;
            teamModal.classList.add('is-open');
            modalPrevBtn.style.display = 'block';
            modalNextBtn.style.display = 'block';
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

        const filterButtons = document.querySelectorAll('.team__filter');
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelector('.team__filter.active').classList.remove('active');
                    button.classList.add('active');
                    const filter = button.getAttribute('data-filter');
                    teamCards.forEach(card => {
                        const specialties = card.getAttribute('data-specialty');
                        card.style.display = (filter === 'all' || specialties.includes(filter)) ? 'block' : 'none';
                    });
                });
            });
        }
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
    const bookingOptions = document.querySelectorAll('.modal__option');
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
    }

    /*=============== FAQ ACCORDION ===============*/
    const faqItems = document.querySelectorAll('.faq__item');
    if (faqItems.length > 0) {
        faqItems.forEach((item) => {
            const faqHeader = item.querySelector('.faq__header');
            faqHeader.addEventListener('click', () => {
                const openItem = document.querySelector('.faq-open');
                if (openItem && openItem !== item) {
                    openItem.classList.remove('faq-open');
                }
                item.classList.toggle('faq-open');
            });
        });
    }

    /*=============== SWIPER JS ===============*/
    if (document.querySelector(".cabinet-swiper")) {
        new Swiper(".cabinet-swiper", { spaceBetween: 30, loop: true, pagination: { el: ".swiper-pagination", clickable: true }, navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } });
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
