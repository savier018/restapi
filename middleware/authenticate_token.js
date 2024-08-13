require('dotenv').config();
const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.TOKEN_SECRET

const verifyToken = (req, res, next) => {
  const token = req.headers['token'] 

  console.log('Token recibido:', token);

  if (!token) {
    console.log('Token no encontrado en el requerimiento');
    return res.status(408).json({ message: 'Token no encontrado en el requerimiento' });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('Error de verificación del token:', err);
      return res.status(408).json({ message: 'Token inválido' });
    }

    console.log('Token decodificado:', decoded);
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;