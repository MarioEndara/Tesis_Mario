// Rutas de operaciones autorizadas para el rol de Secretaría
const express = require('express');
const router = express.Router();
const verificarRol = require('../middleware/verificarRol');
const Catequesis = require('../models/Catequesis');
const Bautismo = require('../models/Bautismo');
const Matrimonio = require('../models/Matrimonio');
const Pago = require('../models/Pago');

router.use(verificarRol(['Secretario/a']));

router.post('/inscripciones', async (req, res) => {
    try {
        const { tipo, ...datos } = req.body;
        let nuevaInscripcion;
        
        if (tipo === 'Bautismo') {
            nuevaInscripcion = new Bautismo(datos);
        } else if (tipo === 'Matrimonio') {
            nuevaInscripcion = new Matrimonio(datos);
        } else {
            nuevaInscripcion = new Catequesis(datos);
        }

        await nuevaInscripcion.save();
        res.status(201).json({ mensaje: 'Inscripción registrada con éxito', nuevaInscripcion });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar la inscripción', error: error.message });
    }
});

router.put('/actualizar/:tipo/:id', async (req, res) => {
    try {
        const { tipo, id } = req.params;
        let modelo = Catequesis;
        if (tipo === 'bautismo') modelo = Bautismo;
        if (tipo === 'matrimonio') modelo = Matrimonio;

        const actualizado = await modelo.findByIdAndUpdate(id, req.body, { new: true });
        if (!actualizado) return res.status(404).json({ mensaje: 'Registro no encontrado' });
        res.json({ mensaje: 'Información actualizada correctamente', actualizado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la información', error: error.message });
    }
});

router.get('/participantes/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;
        let modelo = Catequesis;
        if (tipo === 'bautismo') modelo = Bautismo;
        if (tipo === 'matrimonio') modelo = Matrimonio;

        const participantes = await modelo.find();
        res.json(participantes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al consultar los participantes', error: error.message });
    }
});

router.put('/verificar-requisitos/:tipo/:id', async (req, res) => {
    try {
        const { tipo, id } = req.params;
        const { requisitosCumplidos, observaciones } = req.body;
        let modelo = Catequesis;
        if (tipo === 'bautismo') modelo = Bautismo;
        if (tipo === 'matrimonio') modelo = Matrimonio;

        const verificado = await modelo.findByIdAndUpdate(
            id, 
            { requisitosCumplidos, observaciones }, 
            { new: true }
        );
        res.json({ mensaje: 'Requisitos verificados y actualizados', verificado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al verificar los requisitos', error: error.message });
    }
});

router.post('/pagos', async (req, res) => {
    try {
        const nuevoPago = new Pago({
            ...req.body,
            registradoPor: req.usuario.id
        });
        await nuevoPago.save();
        res.status(201).json({ mensaje: 'Pago registrado exitosamente', nuevoPago });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar el pago', error: error.message });
    }
});

router.get('/reportes', async (req, res) => {
    try {
        const reportes = await Pago.find().populate('participante');
        res.json({ mensaje: 'Reporte generado con éxito', totalRegistros: reportes.length, reportes });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar el reporte', error: error.message });
    }
});

module.exports = router;