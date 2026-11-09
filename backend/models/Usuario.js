const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    cedula: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'Secretario/a' },
    activo: { type: Boolean, default: false },
    direccion: { type: String, required: false },
    fechaNacimiento: { type: Date, required: false },
    padres: { type: Object, required: false }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);