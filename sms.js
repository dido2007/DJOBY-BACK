require('dotenv').config();
const twilio = require('twilio');

let verificationCode = null;

async function sendVerificationSMS(phoneNumber) {
  verificationCode = Math.floor(100000 + Math.random() * 900000);

  console.log(process.env.ACCOUNTSID);
  console.log(process.env.AUTHTOKEN);
  console.log(verificationCode);

  try {
    const twilioClient = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

    const message = await twilioClient.messages.create({
      body: `Bienvenue sur DJOBY. Votre code de vérification est : ${verificationCode}`,
      from: process.env.TWILIONUMBER,
      to: phoneNumber,
    });

    console.log(`SMS envoyé avec succès. SID du message : ${message.sid}`);

    return verificationCode;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'envoi du SMS :', error);
    throw error;
  }
}

module.exports = sendVerificationSMS;
