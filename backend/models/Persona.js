const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    cedula: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    // CAMPOS DE ACCESO PARA EL FELIGRÉS
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'feligres' }, // Esto lo diferencia del admin
    padres: {
        nombrePadre: { type: String },
        nombreMadre: { type: String },
        contacto: { type: String }
    },
    registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Persona', PersonaSchema);