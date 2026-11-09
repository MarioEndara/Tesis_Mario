//Operador1,Operador2,Operador3

const express = require('express');
const router = express.Router();

router.post('/inscripciones', (req, res) => {
    res.json({ mensaje: 'Ruta para registro de inscripciones (Operador 1)' });
});

router.put('/actualizar/:id', (req, res) => {
    res.json({ mensaje: 'Ruta para actualización de información (Operador 1)' });
});

router.get('/participantes', (req, res) => {
    res.json({ mensaje: 'Ruta para consulta de participantes (Operador 1)' });
});

router.post('/verificar-requisitos', (req, res) => {
    res.json({ mensaje: 'Ruta para verificación de requisitos (Operador 1)' });
});

router.post('/pagos', (req, res) => {
    res.json({ mensaje: 'Ruta para registro de pagos (Operador 1)' });
});

router.get('/reportes', (req, res) => {
    res.json({ mensaje: 'Ruta para generación de consultas y reportes (Operador 1)' });
});

module.exports = router;