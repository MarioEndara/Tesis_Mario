const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/olvide-password', authController.recuperarPassword);
router.post('/registro', authController.registrarUsuario);
router.post('/login', authController.autenticarUsuario);
// Ruta para procesar la nueva contraseña usando el token
router.post('/recuperar-password', authController.recuperarPassword);
// Si tienes la de nuevo password, agrégala también:
router.post('/nuevo-password/:token', authController.nuevoPassword);

module.exports = router;