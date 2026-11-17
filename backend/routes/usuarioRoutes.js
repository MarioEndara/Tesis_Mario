const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.registrarPersona);
router.get('/', usuarioController.consultarPersona);
router.put('/:id', usuarioController.editarPersona);
router.delete('/:id', usuarioController.eliminarPersona);

module.exports = router;