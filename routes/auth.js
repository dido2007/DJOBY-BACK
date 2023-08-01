const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;
const crypto = require("crypto");
const sendVerificationSMS = require('../sms');

module.exports = (db) => {

  // router.post("/signup", async (req, res) => {
  //   try {
  //     const { phone_number } = req.body;

  //     const existingUser = await db.collection('auth').findOne({
  //       phone_number: phone_number,
  //     });

  //     if (existingUser) {
  //       return res.json({
  //         success: false,
  //         error: "Phone number already registered. Please use a different number."
  //       });
  //     }

  //     const verificationCode = await sendVerificationSMS(phone_number);

  //     await db.collection('auth').insertOne({
  //       phone_number: phone_number,
  //       verification_code: verificationCode.toString(),
  //     });

  //     res.json({ success: true });
  //   } catch (error) {
  //     console.error(error);
  //     return res.json({ success: false, error: "An error occurred" });
  //   }
  // });

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
      } else {
        res.json({ success: false, error: "Error sending verification code" });
      }
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: "An error occurred" });
    }
  });


  return router;
};
