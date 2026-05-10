const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 30* 1000, // 30 seconds
  max: 5, // 5 attempts per IP
  message: { message: 'Too many login attempts. Try again in 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 3 registrations per IP
  message: { message: 'Too many registrations. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, registerLimiter };

