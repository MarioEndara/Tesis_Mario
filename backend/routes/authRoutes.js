// Rutas de autenticación, registro y autorización de usuarios
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/olvide-password', authController.recuperarPassword);
router.post('/registro', authController.registrarUsuario);
router.post('/login', authController.autenticarUsuario);
router.post('/recuperar-password', authController.recuperarPassword);
router.post('/nuevo-password/:token', authController.nuevoPassword);
router.get('/aprobar/:id', authController.aprobarUsuario);
router.get('/rechazar/:id', authController.rechazarUsuario);

module.exports = router;