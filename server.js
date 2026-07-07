require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());              
app.use(express.json());        
app.use(morgan('dev'));         

// Ruta de prueba con validación de entrada
app.post(
  '/api/echo',
  body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
  (req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    res.json({ recibido: req.body.mensaje });
  }
);


app.post(
  '/api/registro',

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .escape(),

  body('correo')
    .isEmail()
    .withMessage('Correo electrónico no válido')
    .normalizeEmail(),

  (req, res) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array()
      });
    }

    // Principio de codificación segura:

     /*Principio de codificación segura: Nunca confiar en la entrada del usuario. 
     Antes de procesar la información enviada por el usuario, se valida que el nombre no esté vacío 
     y que el correo tenga un formato válido. Además, los datos se sanitizan para reducir el riesgo de 
     recibir información maliciosa y prevenir problemas como inyecciones de código 
     o errores en la aplicación. */

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo
      }
    });
  }
);


app.get('/api/salud', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;