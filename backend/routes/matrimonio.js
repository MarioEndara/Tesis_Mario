const express = require('express');
const router = express.Router();
const Matrimonio = require('../models/Matrimonio');

// Definimos la ruta POST
router.post('/guardar', async (req, res) => {
    try {
        const nuevoMatrimonio = new Matrimonio(req.body);
        await nuevoMatrimonio.save();
        return res.status(200).json({ msg: "¡Matrimonio registrado con éxito!" });
    } catch (err) {
        console.error("Error al guardar:", err.message);
        return res.status(400).json({ msg: "Error: Datos incompletos o cédula duplicada" });
    }
});
router.get('/', async (req, res) => {
    try {
        const matrimonios = await Matrimonio.find().sort({ createdAt: -1 }); // Trae todos los registros, el más nuevo primero
        res.json(matrimonios);
    } catch (err) {
        console.error("Error al obtener matrimonios:", err.message);
        res.status(500).send("Error en el servidor al consultar");
    }
});
router.get('/:id', async (req, res) => {
    try {
        const matrimonio = await Matrimonio.findById(req.params.id);
        if (!matrimonio) return res.status(404).json({ msg: "Matrimonio no encontrado" });
        res.json(matrimonio);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener el registro");
    }
});
router.put('/:id', async (req, res) => {
    try {
        const matrimonioActualizado = await Matrimonio.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true } // Esto devuelve el documento ya actualizado
        );

        if (!matrimonioActualizado) {
            return res.status(404).json({ msg: "No se encontró el registro para actualizar" });
        }

        res.json({ msg: "¡Matrimonio actualizado correctamente!", matrimonioActualizado });
    } catch (err) {
        console.error("Error al actualizar:", err.message);
        res.status(500).send("Error en el servidor al intentar actualizar");
    }
});

module.exports = router;