const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require('cors');

// Express app initialization
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // remplacer par l'URL de votre application front-end
    credentials: true
  }));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));

  // DATABASE CONNECTION

  mongoose.connect('REDACTED_SECRET', {
useNewUrlParser: true,
useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log('Error in connecting to database'));
db.once('open', () => console.log('Connected to Database'));

// Import routes and configuration
const authRoutes = require('.')(db);


app.use('/api/auth', authRoutes);

app.listen(3500, () => console.log('Server listening on port 3500'));   