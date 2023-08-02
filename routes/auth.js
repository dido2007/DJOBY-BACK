require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;
const crypto = require("crypto");
const twilio = require('twilio');
const VerificationCodePost = require('../models/VerificationCodePost');


module.exports = (db) => {  
  
  let verification_code = null;

  console.log("Valeur de depart du verification code : " + verification_code)

  async function sendVerificationSMS(phoneNumber) {
    verification_code = Math.floor(100000 + Math.random() * 900000);
  
    console.log("Account SID : " + process.env.ACCOUNTSID + " \n ");
    console.log("AUTHTOKEN : " + process.env.AUTHTOKEN + " \n ");
    console.log("Code de verification : " + verification_code + " \n ");
  
    try {
      const twilioClient = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
  
      console.log("Valeur de la variable twilioClient : " + twilioClient + " \n ");

      const message = await twilioClient.messages.create({
        body: `Bienvenue sur DJOBY. Votre code de vérification est : ${verification_code}`,
        from: process.env.TWILIONUMBER,
        to: phoneNumber,
      });
  
      console.log(`SMS envoyé avec succès. SID du message : ${message.sid}`);
  
      return verification_code;
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'envoi du SMS :', error);
      throw error;
    }
  }
  

  router.post("/login", async (req, res) => {
    try {
      const { phone_number } = req.body;

      console.log("La varibale phone_number est egale a : " + phone_number + " \n ")

      const user = await db.collection('auth').findOne({
        phone_number: phone_number,
      });

      console.log("Le resultat de la requete a la blase de donnee : " + user + " \n ")

      if (!user) {
        console.log("Numero de telephone pas trouve a la base de donnee" + " \n ");
        return res.json({
          success: false,
          error: "Phone number not found. Please sign up first"
        });
      }

      // Sending the verification code to the phone number
      const verificationSent = await sendVerificationSMS(phone_number);
      console.log("Contenu de la variable verification sent : " + verificationSent + " \n ")
      if (verificationSent) {
        res.json({ success: true });
        console.log(verification_code);
        const verificationCodePost = new VerificationCodePost({verification_code, phone_number})
        await verificationCodePost.save();

        console.log("verification_code ajoute avec success : ", verificationCodePost + " \n ");
      } else {
        console.log("Echec lors de l'ajout du code de verification dans la base de donne." + " \n ")
        res.json({ success: false, error: "Error sending verification code" });
      }
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: "An error occurred" });
    }
  });

  router.post("/verification", async (req, res) => {
    try {
      console.log("Request Body : " + req.body + "\n");

      console.log("Request Body phone_number : " + req.body.phone_number + "\n");

      console.log("Request Body verification_code  : " + req.body.verification_code + "\n");

      //Phone number et Verification code from the front
      const code = req.body.verification_code;

      const phone = req.body.phone_number;


      console.log("Type Numero de tel obtenu du front : " + typeof phone + "\n");
      
      console.log("Type Code de verification obtenue du front : " + typeof code + "\n");
      
      console.log("Numero de tel obtenu du front : " + phone + "\n");
      
      console.log("Code de verification obtenue du front : " + code + "\n");

      const verifCode = await db.collection('verifcodes').findOne({
        verification_code: parseInt(code),
        phone_number: phone,
      });

      console.log("Cherche des donnes du front dans la database : " + verifCode + '\n' + '-------------------------------' + '\n');

      if (!verifCode) {
        return res.json({
          success: false,
          error: "The verification code is wrong"
        });
      } else{
        res.json({ success: true });
      }

      const suppressionDuCode = await db.collection('verifcodes').deleteOne({
        verification_code: parseInt(code),
        phone_number: phone,
      });

      if (suppressionDuCode) {
        console.log("Le code a ete supprime avec succes");
      } else{
        console.log("Erreur lors de la suppression du code");
      }

  

    }
    catch (error) {
      console.error('Une erreur s\'est produite lors de la verification du code de verification :', error);
      throw error;
    }
  })


  return router;
};
