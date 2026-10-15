const express = require('express');
const router = express.Router();
const catequesisController = require('../controllers/catequesisController');

// 1. Crear inscripción (POST)
router.post('/', catequesisController.crearInscripcion);

// 2. Obtener todos los inscritos (GET)
router.get('/', catequesisController.obtenerInscritos);

// 3. Obtener un inscrito específico por ID (GET)
// Esta función la agregamos hace un momento al controlador
router.get('/:id', catequesisController.obtenerInscritoPorId);

// 4. Actualizar inscripción (PUT)
// Esta función también la agregamos al controlador
router.put('/:id', catequesisController.actualizarInscripcion);

module.exports = router;