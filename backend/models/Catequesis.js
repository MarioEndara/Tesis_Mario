// Modelo de inscripciones de catequesis con asignación de catequista, paralelo y registro de asistencias
const mongoose = require('mongoose');

const CatequesisSchema = mongoose.Schema({
    nombreEstudiante: { type: String, required: true, trim: true },
    apellidoEstudiante: { type: String, required: true, trim: true },
    cedulaEstudiante: { type: String, required: true, unique: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    nivel: { type: String, required: true },
    paralelo: { type: String, default: 'A', trim: true },
    catequista: { type: mongoose.Schema.Types.ObjectId, ref: 'Operador', required: false },
    nombreRepresentante: { type: String, required: true },
    telefonoRepresentante: { type: String, required: true },
    direccion: { type: String, required: true, trim: true },
    asistencias: [
        {
            fecha: { type: Date, default: Date.now },
            estado: { type: String, enum: ['Presente', 'Falta', 'Justificado'], default: 'Presente' }
        }
    ],
    fechaInscripcion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Catequesis', CatequesisSchema);