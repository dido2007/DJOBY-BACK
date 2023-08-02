require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;
const crypto = require("crypto");
const twilio = require('twilio');
const VerificationCodePost = require('../models/VerificationCodePost');


module.exports = (db) => {  
  
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
  

  router.post("/login", async (req, res) => {
    try {
      const phone_number = req.body;

      console.log(phone_number)
      console.log(phone_number.phone_number)


      const user = await db.collection('auth').findOne({
        phone_number: phone_number.phone_number,
      });

      console.log(user)

      if (!user) {
        return res.json({
          success: false,
          error: "Phone number not found. Please sign up first"
        });
      }

      // Sending the verification code to the phone number
      const verificationSent = await sendVerificationSMS(phone_number.phone_number);

      if (verificationSent) {
        res.json({ success: true });
        console.log(verificationCode);
        const verificationCodePost = new VerificationCodePost({verificationCode})
        await verificationCodePost.save();

        console.log("VerificationCode ajoute avec success : ", verificationCodePost);

        res.status(201).json(verificationCodePost)
      } else {
        res.json({ success: false, error: "Error sending verification code" });
      }
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: "An error occurred" });
    }
  });

  router.post("/verification", async (req, res) => {
    try {
      const phoneData = req.body; 

      console.log(phoneData.phone_number);
      console.log(phoneData.verification_code);
      
      const verifCode = await db.collection('verifCode').findOne({
        verifCode: phoneData.verification_code,
      });

      console.log(user)

      if (!verifCode) {
        return res.json({
          success: false,
          error: "The verification code is wrong"
        });
      } else{
        res.json({ success: true });
      }

    }
    catch (error) {
      console.error('Une erreur s\'est produite lors de la verification du code de verification :', error);
      throw error;
    }
  })


  return router;
};
