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
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', Userrouter);
app.use('/api', datarouter);

module.exports = app;
