const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
    req.user = user;
    next();
  });
};

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
     
    const user = await User.findOne({
      'refreshTokens.token': refreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() }
    });
  
    if (!user) {
      return res.status(403).json({ message: "Refresh token inválido o expirado" });
    }
   
    const payload = { id: user._id, username: user.username, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  
    res.json({ accessToken });
});

router.get('/validate-token', verifyAccessToken, (req, res) => {
  res.json({ 
    message: "Token válido",
    user: req.user 
  });
});

module.exports = router;