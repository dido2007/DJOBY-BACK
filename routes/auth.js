require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const twilio = require('twilio');
const VerificationCodePost = require('../models/VerificationCodePost');
const Users = require('../models/Users');



module.exports = (db) => {  
  
  let verification_code = null;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
       cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({
      storage: storage
  });
 
  console.log("Valeur de depart du verification code : " + verification_code)

  async function sendVerificationSMS(phone_number) {
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
        to: phone_number,
      });
  
      console.log(`SMS envoyé avec succès. SID du message : ${message.sid}`);
  
      return verification_code;
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'envoi du SMS :', error);
      throw error;
    }
  }

  const verificationSystem = async (phone_number) => {
    const verificationSent = await sendVerificationSMS(phone_number);
    console.log("Contenu de la variable verification sent : " + verificationSent + " \n ")
    if (verificationSent) {
      console.log(verification_code);
      const verificationCodePost = new VerificationCodePost({verification_code, phone_number})
      await verificationCodePost.save();
      console.log("verification_code ajoute avec success : ", verificationCodePost + " \n ");
      return true
    } else {
      console.log("Echec lors de l'ajout du code de verification dans la base de donne." + " \n ")
      return false 
    }
  };
  

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

      res.json({ success: verificationSystem(phone_number) });
      
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: "An error occurred" });
    }
  });

  router.post("/signup-verification", async (req, res) => {
    try {
      const { phone_number } = req.body;

      console.log("La varibale phone_number est egale a : " + phone_number + " \n ")

      res.json({ success: verificationSystem(phone_number) });

    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: "An error occurred" });
    }

  });

  router.post("/signup", upload.fields([{ name: 'avatar', maxCount  : 1 }, { name: 'projectImages', maxCount: 8 }]), async (req, res) => {
    try {

      const data = JSON.parse(req.body.data); // Parsez la chaîne JSON dans un objet

      const user = new Users({
        phoneNumber: data.phone,
        fullName: data.fullname,
        age: data.age,
        avatar: req.files['avatar'] ? req.files['avatar'][0].path : null,
        userType: data.usertype,
        interestedServices: data.interestedservices,
        skills: data.skills,
        projectImages: req.files['projectImages'] ? req.files['projectImages'].map(file => file.path) : [],
      });
    
      await user.save()
      console.log("Utilisateur ajouté avec succès");
      res.json({ success: true });

    } catch(error) {
      console.log("Echec lors de l'ajout du user dans la base de donne." + error + " \n ")
      res.json({ success: false, error: "Error sending user" });
    }
  }); 

  router.post("/verification", async (req, res) => {
    try {
      console.log("Request Body : " + req.body + "\n");

      console.log("Request Body phone_number : " + req.body.phone_number + "\n");

      console.log("Request Body verification_code  : " + req.body.verification_code + "\n");

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
