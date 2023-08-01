const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;
const cookieParser = require('cookie-parser');
const crypto = require("crypto");

// Importez la fonction sendVerificationSMS du fichier sms.js
const { sendVerificationSMS } = require('./sms'); // Remplacez "./chemin/vers/sms.js" par le chemin réel

router.post("/login", (request, response) => {
  try {
    const { phone_number, verification_code } = request.body;

    console.log(`${phone_number},  ${verification_code}`);

    // Vérifier d'abord si le numéro de téléphone existe dans la base de données
    db.collection('auth').findOne({
      phone_number: phone_number,
    }, (err, user) => {
      if (user === null) {
        return response.json({
          error: "Phone number not found. Please create an account first"
        });
      } else if (err) {
        console.log(err);
        return response.json({
          error: "Error occurred while searching for the phone number"
        });
      }

      // Une fois que vous avez vérifié que le numéro de téléphone existe dans la base de données,
      // appelez la fonction sendVerificationSMS pour envoyer le code de vérification
      sendVerificationSMS(phone_number);

      // Enregistrez le code de vérification généré dans une variable pour la vérification ultérieure
      const storedVerificationCode = verificationCode;

      // Le reste de votre code pour la vérification du code de l'utilisateur
      // Comparez le code entré par l'utilisateur avec le code de vérification stocké
      if (verification_code === storedVerificationCode.toString()) {
        console.log('Le code de vérification est correct. Validation réussie !');
        // Continuez avec le reste du processus de connexion réussie
        return response.json({ message: "Login successful" });
      } else {
        console.log('Le code de vérification est incorrect. Validation échouée !');
        return response.json({ error: "Invalid verification code" });
      }
    });
  } catch (error) {
    // Gérez les erreurs ici
    console.error(error);
    return response.json({ error: "An error occurred" });
  }
});

return router;