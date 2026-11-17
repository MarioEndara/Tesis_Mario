// Rutas de catequesis para inscripciones, consultas filtradas, asistencias y eliminación
const express = require('express');
const router = express.Router();
const catequesisController = require('../controllers/catequesisController');

router.post('/', catequesisController.crearInscripcion);
router.get('/', catequesisController.obtenerInscritos);
router.get('/:id', catequesisController.obtenerInscritoPorId);
router.put('/:id', catequesisController.actualizarInscripcion);
router.put('/:id/asistencia', catequesisController.registrarAsistencia);
router.delete('/:id', catequesisController.eliminarInscripcion);

module.exports = router;