const Catequesis = require('../models/Catequesis');

exports.crearInscripcion = async (req, res) => {
    try {
        const { cedulaEstudiante } = req.body;
        let existente = await Catequesis.findOne({ cedulaEstudiante });
        if (existente) {
            return res.status(400).json({ msg: "El estudiante ya está inscrito en Catequesis." });
        }
        const nuevaInscripcion = new Catequesis(req.body);
        await nuevaInscripcion.save();
        res.json({ msg: "Inscripción a Catequesis realizada con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al inscribir');
    }
};

exports.obtenerInscritos = async (req, res) => {
    try {
        const inscritos = await Catequesis.find().sort({ fechaInscripcion: -1 });
        res.json(inscritos);
    } catch (error) {
        res.status(500).send('Error al obtener datos');
    }
};
exports.obtenerInscritoPorId = async (req, res) => {
    try {
        const inscrito = await Catequesis.findById(req.params.id);
        if (!inscrito) {
            return res.status(404).json({ msg: "Inscripción no encontrada" });
        }
        res.json(inscrito);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los datos del estudiante');
    }
};

// Guardar los cambios de una edición (PUT)
exports.actualizarInscripcion = async (req, res) => {
    try {
        const actualizado = await Catequesis.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json({ msg: "Inscripción actualizada correctamente", actualizado });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al actualizar la inscripción');
    }
};
// Eliminar una inscripción de catequesis
exports.eliminarInscripcion = async (req, res) => {
    try {
        const inscripcion = await Catequesis.findById(req.params.id);
        if (!inscripcion) {
            return res.status(404).json({ msg: "Inscripción no encontrada" });
        }
        await Catequesis.findByIdAndDelete(req.params.id);
        res.json({ msg: "Inscripción eliminada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar la inscripción');
    }
};