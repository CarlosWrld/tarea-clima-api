const express = require('express');
const { param, validationResult } = require('express-validator');
const { obtenerClima } = require('../services/clima');

const router = express.Router();

function validar(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array()
    });
  }

  next();
}

// GET /api/clima/:ciudad
router.get(
  '/:ciudad',
  param('ciudad')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es obligatoria')
    .matches(/^[a-zA-ZÀ-ÿñÑ\s.-]+$/)
    .withMessage('La ciudad contiene caracteres inválidos')
    .isLength({ min: 2, max: 60 })
    .withMessage('La ciudad debe tener entre 2 y 60 caracteres'),
  validar,
  async (req, res) => {
    const ciudad = req.params.ciudad;

    try {
      const clima = await obtenerClima(ciudad);

      res.status(200).json({
        clima
      });
    } catch (error) {
      res.status(502).json({
        error: error.message
      });
    }
  }
);

module.exports = router;