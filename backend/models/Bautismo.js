const mongoose = require('mongoose');

const BautismoSchema = mongoose.Schema({
    // Datos del Bautizado
    nombreNiño: { type: String, required: true, trim: true },
    apellidoNiño: { type: String, required: true, trim: true },
    cedulaNiño: { type: String, required: true, unique: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    lugarNacimiento: { type: String, required: true },
    genero: { type: String, enum: ['Masculino', 'Femenino'], required: true },
    direccion:{ type: String, required: true, trim: true },

    // Datos del Sacramento
    fechaBautismo: { type: Date, default: Date.now },
    celebrante: { type: String, required: true }, // Sacerdote que bautiza

    // Datos de los Padres
    nombrePadre: { type: String, required: true },
    nombreMadre: { type: String, required: true },
    
    // Datos de los Padrinos
    padrino: { type: String, required: true },
    madrina: { type: String, required: true },

    // Datos de Registro (Libro Parroquial)
    libro: { type: String, required: true },
    tomo: { type: String, required: true },
    pagina: { type: String, required: true },
    acta: { type: String, required: true },

    // Auditoría
    usuarioRegistra: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bautismo', BautismoSchema);