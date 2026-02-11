// Fichier: js/data.js
const teamMembers = {
    1: {
        firstName: 'Gilles',
        lastName: 'PIRAUX',
        inami: '54159652527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Anglais'],
        specialties: ['Kiné Générale', 'Kiné Sportive', 'Ostéopathie D.O.'],
        techniques: ['Thérapie manuelle', 'Dry Needling', 'Analyse de la course', 'Clinique du coureur'],
        photo: '/assets/blob/GILLES_mini.png',
        description: 'Prise en charge globale et centrée sur la rééducation active pour un retour rapide et durable à vos activités. Gilles vous accompagne dans la gestion de vos douleurs et l’optimisation de vos performances.',
        contact: {
            email: 'gillespiraux@gmail.com', 
            phone: '0478 62 93 21',
            rosaLink: 'https://rosa.be/fr/hp/gilles-piraux',
            
        }
    },
    2: {
        firstName: 'Maria',
        lastName: 'KALALA BELTRAN',
        inami: '54584967527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Espagnol', 'Anglais'],
        specialties: ['Kiné Générale', 'Kiné Périnatale', 'Orthopédie', 'Rééducation Abdomino-pelvienne', 'Kiné Périnatale'],
        techniques: ['Thérapie manuelle', 'Myofasciale', 'Crochetage', 'ATM'],
        photo: '/assets/blob/MARIA_mini.png',
        description: 'Passionnée par le mouvement, l\'anatomie fonctionnelle et la biomécanique, Maria vous accompagne dans toute pathologie musculo squelettique. Elle a un intérêt particulier pour les douleurs autours du rachis, des cervicales jusqu\'au sacrum, et une expertise dans les douleurs liées au plancher pelvien',
        contact: {
            email: 'maria.kalala.beltran@gmail.com',
            phone: '0491 17 78 41',
            /* rosaLink: 'https://rosa.be/fr/hp/maria-kalala-beltran' */
            
        }
    },
    3: {
        firstName: 'Olivier',
        lastName: 'VAN ROY',
        inami: '54859438527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Anglais', 'Néerlandais'],
        specialties: ['Kiné Générale', 'Kiné Sportive', 'Orthopédie', 'Pré/post-opératoire', 'Cépahlées', 'Rhumatologie', 'Reconditionnement physique'],
        techniques: ['Thérapie manuelle', 'Ondes de choc', 'Neurodynamique', 'Méthode McKenzie', 'Analyse de la course', 'Prévention des blessures du coureur', 'Crochetage'],
        photo: '/assets/blob/OLIVIER_mini.png',
        description: 'A l\'écoute et bienveillant, Olivier vous accompagne dans la gestion de vos douleurs et l\'optimisation de votre pratique sportive. Par une prise en charge individualisée, il vous aide à mieux comprendre votre corps et à vous rendre acteur de votre rééducation afin de prévenir durablement tout risque de récidive.',
        contact: {
            email: 'kine.vanroy@gmail.com', 
            phone: '0479 75 59 82',
            rosaLink: 'https://rosa.be/fr/hp/olivier-van-roy/',
            }
    },
    4: {
        firstName: 'Fanny',
        lastName: 'Garo',
        inami: '54499944527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Anglais'],
        specialties: ['Kiné Viscérale', 'Kiné Périnatale', 'Rééducation Abdomino-pelvienne', 'Thérapie maxillo-faciale'],
        techniques: ['Myofasciale', 'Pilates', 'Nutrithérapie', 'Crochetage', 'Renforcement musculaire', 'ATM'],
        photo: '/assets/blob/FANNY_mini.png',
        description: 'Fanny vous propose une approche globale. Son sens de l’empathie fait d’elle une thérapeute profondément humaine à qui il tient à coeur de proposer une écoute attentive. Entre-autres, voici certains de ses domaines de prédilection: le travail viscéral, la traumatologie, le suivi en période de grossesse et la rééducation abdominale en post-partum…',
        contact: {
            email: 'kine.garo.fanny@gmail.com',
            phone: '0472 91 55 42',
            /* rosaLink: 'https://rosa.be/fr/hp/fanny-garo/' */
            contactNote: 'Contactez-moi préférentiellement par SMS ou via WhatsApp, je vous recontacterai dès que possible, par appel ou message'
        }
    },
    5: {
        firstName: 'Simon',
        lastName: 'LE CLEF',
        inami: '54157177527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Anglais', 'Espagnol'],
        specialties: ['Kiné Générale', 'Kiné Sportive', 'Ostéopathie D.O.'],
        techniques: ['Thérapie manuelle', 'Dry Needling', 'Analyse de la course', 'Clinique du coureur'],
        photo: '/assets/blob/SIMON_mini.png',
        description: 'Prise en charge globale et centrée sur la rééducation active pour un retour rapide et durable à vos activités. Simon vous accompagne dans la gestion de vos douleurs et l\'optimisation de vos performances.',
        contact: {
            email: 'Simon.leclef@gmail.com',
            phone: '0474 71 61 63',
            rosaLink: 'https://rosa.be/fr/hp/simon-le-clef/',
            
        }
    },
    6: {
        firstName: 'Mathilde',
        lastName: 'ESCOYEZ',
        inami: '54999493527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Anglais'],
        specialties: ['Kiné Générale', 'Kiné Pelvi-périnéale', 'Kiné Périnatale'],
        techniques: ['Thérapie manuelle', 'Biofeedback', 'Gestion de la douleur'],
        photo: '/assets/blob/MATHILDE_mini.png',
        description: 'Je vous propose une prise en charge individualisée pour tous vos troubles liés à la sphère abdo-pelvienne. Traitement de la douleur pelvienne, incontinence, troubles de la statique, constipation chronique. Je vous accompagne également dans une prise en charge globale et dynamique en post-partum, centrée sur vos besoins.',
        contact: {
            email: 'math.escoyez@gmail.com',
            phone: '0488 63 18 84',
            rosaLink: 'https://rosa.be/fr/hp/mathilde-escoyez',
            
        }
    },
    7: {
        firstName: 'Thomas',
        lastName: 'BASTARD',
        inami: '55675723527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Anglais'],
        specialties: ['Kiné Générale'],
        techniques: ['Pilates', 'Thérapie manuelle', 'Myofasciale', 'Neurodynamique', 'Renforcement musculaire ciblé'],
        photo: '/assets/blob/THOMAS_mini.png',
        description: 'Une prise en charge active et personnalisée visant à soulager vos douleurs et restaurer votre fonction. L\'accompagnement est centré sur un retour durable et sécurisé à vos activités du quotidien ou sportives.',
        contact: {
            email: 'Thomas.bastard.physio@gmail.com',
            phone: '0486 47 29 87',
            /* rosaLink: 'https://rosa.be/fr/hp/thomas-bastard' */
            
        }
    },
    8: {
        firstName: 'Marie Inès',
        lastName: 'Koninckx',
        inami: '54742048527',
        convention: 'Entièrement conventionné',
        languages: ['Français', 'Anglais'],
        specialties: ['Kiné Générale', 'Kiné Sportive', 'Orthopédie'],
        techniques: ['Thérapie manuelle', 'Dry Needling', 'ATM', 'Pilates'],
        photo: '/assets/blob/MARIE-INES_mini.png',
        description: 'Prise en charge globale et personnalisée pour tous types de pathologies.',
        contact: {
            email: 'mi.koninckx@kineflagey.be',
            phone: '0470 78 61 44',
            rosaLink: 'https://rosa.be/fr/hp/marie-ines-koninckx',
            
        }
    },
    /* 9: {
        firstName: 'Anne-Sophie',
        lastName: 'Libert',
        specialties: ['Kiné Générale'],
        techniques: [],
        photo: '/assets/blob/ANNE-SOPHIE_mini.png',
        description: 'Anne-Sophie vous accompagne dans votre rééducation avec écoute et bienveillance.',
        contact: {
            email: 'as.libert@kineflagey.be',
            phone: '0478 90 12 34',
            rosaLink: 'https://rosa.be/fr/hp/anne-sophie-libert',
            
        }
    } */
};
