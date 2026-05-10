const controllers = require('../controllers/Userlogincontroller');
const emailotp=require('../controllers/emailotp');
const express = require('express');
const { registerLimiter, loginLimiter } = require('../middleware/rate-limit');

const router = express.Router();

router.post('/register', registerLimiter, controllers.registration);
router.post('/login', loginLimiter, controllers.login);
router.patch('/updatepassword', controllers.updatepassword);
router.delete('/logout', controllers.logout);

router.post('/forotp',emailotp.forotp);
router.post('/verifyotp',emailotp.verifyotp);

module.exports = router;
