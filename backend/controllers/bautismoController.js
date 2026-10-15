const Bautismo = require('../models/Bautismo');

// 1. Crear registro
exports.crearRegistroBautismo = async (req, res) => {
    try {
        const { cedulaNiño } = req.body;
        let registroExistente = await Bautismo.findOne({ cedulaNiño });
        if (registroExistente) {
            return res.status(400).json({ msg: "Este niño ya cuenta con un registro de bautismo en el sistema." });
        }
        const nuevoBautismo = new Bautismo(req.body);
        await nuevoBautismo.save();
        res.json({ msg: "Registro de Bautismo guardado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al guardar');
    }
};

// 2. Obtener registros (ESTO ES LO QUE SEGURAMENTE FALTA)
exports.obtenerBautismos = async (req, res) => {
    try {
        const bautismos = await Bautismo.find().sort({ fechaRegistro: -1 });
        res.json(bautismos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al obtener los datos');
    }
};
// 3. Actualizar un registro de bautismo
exports.actualizarBautismo = async (req, res) => {
    try {
        // Buscamos por ID y actualizamos con los nuevos datos de req.body
        let bautismo = await Bautismo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!bautismo) {
            return res.status(404).json({ msg: "Registro no encontrado" });
        }

        res.json({ msg: "Registro actualizado correctamente", bautismo });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al actualizar');
    }
};

// 4. Eliminar un registro
exports.eliminarBautismo = async (req, res) => {
    try {
        let bautismo = await Bautismo.findById(req.params.id);

        if (!bautismo) {
            return res.status(404).json({ msg: "Registro no encontrado" });
        }

        await Bautismo.findByIdAndDelete(req.params.id);
        res.json({ msg: "Registro eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al eliminar');
    }
};