const mongoose = require('mongoose');

const MatrimonioSchema = new mongoose.Schema({
    // Datos del Esposo
    nombreEsposo: { type: String, required: true },
    apellidoEsposo: { type: String, required: true },
    cedulaEsposo: { type: String, required: true, unique: true },
    
    // Datos de la Esposa
    nombreEsposa: { type: String, required: true },
    apellidoEsposa: { type: String, required: true },
    cedulaEsposa: { type: String, required: true, unique: true },
    
    fechaMatrimonio: { type: Date, required: true },
    celebrante: { type: String, required: true }, // Sacerdote
    
    // Ubicación en libros físicos
    libro: { type: String, required: true },
    tomo: { type: String, required: true },
    pagina: { type: String, required: true },
    
    testigos: { type: String }, // Nombres de los padrinos/testigos
    fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Matrimonio', MatrimonioSchema);