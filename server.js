require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Pour parser le JSON du corps des requêtes

// Configuration du transporteur Nodemailer
// Utilise les variables d'environnement pour la sécurité
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou un autre service SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route pour envoyer l'email
app.post('/send-email', (req, res) => {
    const { prenom, nom, email, telephone, motif, message } = req.body;

    const mailOptions = {
        from: `"${prenom} ${nom}" <${email}>`, // L'expéditeur affiché
        to: process.env.RECIPIENT_EMAIL, // L'email du destinataire (le vôtre)
        replyTo: email, // Pour que "Répondre" fonctionne correctement
        subject: `Nouveau message de ${prenom} ${nom} - Motif: ${motif}`,
        html: `
            <h2>Nouveau message depuis le site KineFlagey</h2>
            <p><strong>Nom:</strong> ${prenom} ${nom}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Téléphone:</strong> ${telephone || 'Non fourni'}</p>
            <p><strong>Motif:</strong> ${motif}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            return res.status(500).send('Erreur lors de l\'envoi du message.');
        }
        res.status(200).send('Message envoyé avec succès !');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});