const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
}

module.exports = { isAuthenticated };
