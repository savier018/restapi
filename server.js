require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_API)

/* Referencia al módulo swagger-ui-express */
const swaggerUi = require('swagger-ui-express')

/* Referencia al archivo con la descripción */
const swaggerFile = require('./swagger_output.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

//Middleware. Revisar en el aula, o que los demas lo mire.
function verifyToken(req, res, next) {
 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) return res.status(408).send('Request Timeout'); 

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(408).send('Request Timeout'); 

      req.user = user; 
      next(); 
  });
}

// middleware a /api
app.use('/api', verifyToken);

/* Ruta Base -> Documentación */
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/api', require('./routes/api'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
