const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const app = express();
const Userrouter = require('./routers/userrouter');
const datarouter = require('./routers/datarouter');
app.use(express.json());
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  "https://secure-password-manager-seven.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {

    console.log("REQUEST ORIGIN:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS BLOCKED"));
    }
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', Userrouter);
app.use('/api', datarouter);

module.exports = app;
