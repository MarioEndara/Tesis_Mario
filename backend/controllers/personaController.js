const Persona = require('../models/Persona');
const bcrypt = require('bcryptjs');

exports.registrarPersona = async (req, res) => {
    try {
        const { cedula, email, password, historial } = req.body;

        // 1. VALIDACIÓN DE CÉDULA Y EMAIL ÚNICOS
        // Buscamos si ya existe alguien con esa cédula O ese correo
        const existePersona = await Persona.findOne({ 
            $or: [{ cedula }, { email }] 
        });
        
        if (existePersona) {
            const mensaje = existePersona.cedula === cedula 
                ? "Ya existe un feligrés con esta cédula." 
                : "Este correo electrónico ya está en uso.";
            return res.status(400).json({ msg: mensaje });
        }

        // 2. TU LÓGICA DE HISTORIAL (Se mantiene intacta)
        if (historial && historial.length > 1) {
            return res.status(400).json({ msg: "Alerta: No se puede ingresar dos niveles diferentes." });
        }

        // 3. CREAR EL REGISTRO
        const nuevaPersona = new Persona(req.body);

        // 4. ENCRIPTAR LA CONTRASEÑA (Obligatorio para que luego puedan hacer Login)
        const salt = await bcrypt.genSalt(10);
        nuevaPersona.password = await bcrypt.hash(password, salt);

        // 5. ASIGNAR ROL POR DEFECTO (Si no viene en el body)
        if (!nuevaPersona.rol) {
            nuevaPersona.rol = 'feligres';
        }

        await nuevaPersona.save();
        
        res.json({ 
            msg: "Registro exitoso. Ahora puede acceder con su correo.", 
            persona: {
                id: nuevaPersona._id,
                nombres: nuevaPersona.nombres,
                rol: nuevaPersona.rol
            } 
        });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).send('Error al guardar el registro en la base de datos');
    }
};
// Busqueda por nombres desde TunderClient
exports.consultarPersona = async (req, res) => {
    try {
        const { nombre } = req.query;
        // Buscamos coincidencias parciales en nombres o apellidos
        const resultados = await Persona.find({
            $or: [
                { nombres: { $regex: nombre, $options: 'i' } },
                { apellidos: { $regex: nombre, $options: 'i' } }
            ]
        });
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ msg: "Error en la consulta" });
    }
};
// Función para editar/actualizar datos
exports.editarPersona = async (req, res) => {
    try {
        // Buscamos por ID y actualizamos con los nuevos datos del body
        const personaActualizada = await Persona.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Esto devuelve el documento ya modificado
        );

        if (!personaActualizada) {
            return res.status(404).json({ msg: "Persona no encontrada" });
        }

        res.json({ msg: "Datos actualizados correctamente", persona: personaActualizada });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar los datos');
    }
};
// Función para eliminar un registro
exports.eliminarPersona = async (req, res) => {
    try {
        const personaEliminada = await Persona.findByIdAndDelete(req.params.id);

        if (!personaEliminada) {
            return res.status(404).json({ msg: "No se encontró el registro para eliminar" });
        }

        res.json({ msg: "Registro eliminado correctamente de la base de datos" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el registro');
    }
};