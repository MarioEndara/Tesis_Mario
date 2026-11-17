const Usuario = require('../models/Usuario');
const Operador = require('../models/Operador');
const bcrypt = require('bcryptjs');

exports.registrarPersona = async (req, res) => {
    try {
        const { cedula, email, password, historial } = req.body;

        const existeUsuario = await Usuario.findOne({ 
            $or: [{ cedula }, { email }] 
        });
        const existeOperador = await Operador.findOne({ 
            $or: [{ cedula }, { email }] 
        });
        
        if (existeUsuario || existeOperador) {
            const coincidencias = existeUsuario || existeOperador;
            const mensaje = coincidencias.cedula === cedula 
                ? "Ya existe un usuario registrado con esta cédula." 
                : "Este correo electrónico ya está en uso.";
            return res.status(400).json({ msg: mensaje });
        }

        if (historial && historial.length > 1) {
            return res.status(400).json({ msg: "Alerta: No se puede ingresar dos niveles diferentes." });
        }

        const nuevoUsuario = new Usuario(req.body);

        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(password, salt);

        nuevoUsuario.rol = 'Usuario';

        await nuevoUsuario.save();
        
        res.json({ 
            msg: "Registro exitoso. Ahora puede acceder con su correo.", 
            persona: {
                id: nuevoUsuario._id,
                nombres: nuevoUsuario.nombres,
                rol: nuevoUsuario.rol
            } 
        });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).send('Error al guardar el registro en la base de datos');
    }
};

exports.consultarPersona = async (req, res) => {
    try {
        const { nombre } = req.query;
        const resultados = await Usuario.find({
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

exports.editarPersona = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json({ msg: "Datos actualizados correctamente", persona: usuarioActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar los datos');
    }
};

exports.eliminarPersona = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return res.status(404).json({ msg: "No se encontró el registro para eliminar" });
        }

        res.json({ msg: "Registro eliminado correctamente de la base de datos" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el registro');
    }
};