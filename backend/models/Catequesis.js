const mongoose = require('mongoose');

const CatequesisSchema = mongoose.Schema({
    nombreEstudiante: { type: String, required: true, trim: true },
    apellidoEstudiante: { type: String, required: true, trim: true },
    cedulaEstudiante: { type: String, required: true, unique: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    nivel: { type: String, required: true }, // Ejemplo: Nivel 1, Nivel 2, Confirmación
    nombreRepresentante: { type: String, required: true },
    telefonoRepresentante: { type: String, required: true },
    direccion: { type: String, required: true, trim: true },
    fechaInscripcion: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Catequesis', CatequesisSchema);