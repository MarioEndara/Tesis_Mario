const mongoose = require('mongoose');

const OperadorSchema = mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    cedula: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'Secretario/a' },
    activo: { type: Boolean, default: false }
}, { collection: 'operadores' });

module.exports = mongoose.model('Operador', OperadorSchema);