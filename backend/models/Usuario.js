const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    cedula: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'Usuario' },
    padres: { type: Object, required: false },
    registro: { type: Date, default: Date.now }
}, { collection: 'usuarios' });

module.exports = mongoose.model('Usuario', UsuarioSchema);