const express = require('express');
const router = express.Router();
const bautismoController = require('../controllers/bautismoController');

// Ruta para crear un nuevo registro de bautismo
// La URL completa será: POST http://localhost:5000/api/bautismo
router.post('/', bautismoController.crearRegistroBautismo);

// Ruta para obtener todos los registros (para las consultas que pide tu tesis)
router.get('/', bautismoController.obtenerBautismos);
// Actualizar registro: PUT /api/bautismo/:id
router.put('/:id', bautismoController.actualizarBautismo);

// Eliminar registro: DELETE /api/bautismo/:id
router.delete('/:id', bautismoController.eliminarBautismo);

module.exports = router;