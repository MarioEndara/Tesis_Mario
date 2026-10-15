const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

// El primer parámetro debe ser '/' porque el prefijo '/api/personas' ya viene desde server.js
router.get('/', personaController.consultarPersona); 

router.post('/', personaController.registrarPersona);
router.put('/:id', personaController.editarPersona);
router.delete('/:id', personaController.eliminarPersona);

module.exports = router;