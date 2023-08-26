require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
// Express app initialization
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized :false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO,
    collection : 'sessions'
  }),

  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
  }));

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log('Error in connecting to the database'));
db.once('open', () => console.log('Connected to the Database'));

// Import routes and configuration
const authRoutes = require('./routes/auth')(db);
const layoutRoutes = require('./routes/layout')(db);

app.use('/api/auth', authRoutes);
app.use('/api/layout', layoutRoutes);

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));
