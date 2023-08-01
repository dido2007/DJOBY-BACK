const twilio = require('twilio');

// Remplacez ces valeurs par celles de votre compte Twilio
const accountSid = 'REDACTED_SECRET';
const authToken = 'REDACTED_SECRET';
const twilioNumber = 'REDACTED_SECRET';

// Variable pour stocker le code de vérification généré
let verificationCode = null;

// Fonction pour envoyer un SMS de vérification
function sendVerificationSMS(phoneNumber) {
  const client = twilio(accountSid, authToken);

  // Générez un code de vérification à 6 chiffres (vous pouvez utiliser un autre mécanisme de génération de code si vous le souhaitez)
  verificationCode = Math.floor(100000 + Math.random() * 900000);

  client.messages
    .create({
      body: `Bienvenue sur DJOBY. Votre code de vérification est : ${verificationCode}`,
      from: twilioNumber,
      to: phoneNumber
    })
    .then((message) => {
      console.log(`SMS envoyé avec succès. SID du message : ${message.sid}`);
      // Vous pouvez également renvoyer le code de vérification ici si vous en avez besoin dans le backend
    })
    .catch((error) => {
      console.error('Une erreur s\'est produite lors de l\'envoi du SMS :', error);
    });
}

module.exports.sendVerificationSMS = sendVerificationSMS;
