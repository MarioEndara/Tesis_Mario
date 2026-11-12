const mongoose = require('mongoose');

const PagoSchema = mongoose.Schema({
    participante: { type: mongoose.Schema.Types.ObjectId, ref: 'Catequesis', required: true },
    monto: { type: Number, required: true },
    concepto: { type: String, required: true },
    fechaPago: { type: Date, default: Date.now },
    registradoPor: { type: String, required: true }
});

module.exports = mongoose.model('Pago', PagoSchema);