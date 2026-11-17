// Controlador de catequesis con filtro de cursos por catequista y gestión de asistencias
const Catequesis = require('../models/Catequesis');
const jwt = require('jsonwebtoken');

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
        let filtro = {};
        const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            try {
                const cifrado = jwt.verify(token, process.env.SECRETA);
                if (cifrado.usuario && cifrado.usuario.rol && cifrado.usuario.rol.toLowerCase() === 'catequista') {
                    filtro.catequista = cifrado.usuario.id;
                }
            } catch (err) {
                return res.status(401).json({ msg: 'Token no válido' });
            }
        }

        const inscritos = await Catequesis.find(filtro)
            .populate('catequista', 'nombres apellidos email')
            .sort({ fechaInscripcion: -1 });
        res.json(inscritos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener datos');
    }
};

exports.obtenerInscritoPorId = async (req, res) => {
    try {
        const inscrito = await Catequesis.findById(req.params.id).populate('catequista', 'nombres apellidos email');
        if (!inscrito) {
            return res.status(404).json({ msg: "Inscripción no encontrada" });
        }
        res.json(inscrito);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los datos del estudiante');
    }
};

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

exports.registrarAsistencia = async (req, res) => {
    try {
        const { fecha, estado } = req.body;
        const inscripcion = await Catequesis.findById(req.params.id);

        if (!inscripcion) {
            return res.status(404).json({ msg: "Inscripción no encontrada" });
        }

        const fechaConsulta = fecha ? new Date(fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const indiceExistente = inscripcion.asistencias.findIndex(
            a => new Date(a.fecha).toISOString().split('T')[0] === fechaConsulta
        );

        if (indiceExistente !== -1) {
            inscripcion.asistencias[indiceExistente].estado = estado;
        } else {
            inscripcion.asistencias.push({
                fecha: fecha ? new Date(fecha) : new Date(),
                estado: estado || 'Presente'
            });
        }

        await inscripcion.save();
        res.json({ msg: "Asistencia registrada/actualizada correctamente", asistencias: inscripcion.asistencias });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al registrar la asistencia');
    }
};

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