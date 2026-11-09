// Coneccion con la base de datos, Middlewares, rutas
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const crearAdminPorDefecto = require('./config/initAdmin');
const crearOperadoresPorDefecto = require('./config/initOperador');

const app = express();

conectarDB().then(async () => {
    await crearAdminPorDefecto();
    await crearOperadoresPorDefecto();
});

app.use(cors());
app.use(express.json());

app.use('/api/personas', require('./routes/personaRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bautismo', require('./routes/bautismoRoutes'));
app.use('/api/catequesis', require('./routes/catequesisRoutes'));
app.use('/api/matrimonio', require('./routes/matrimonio'));
app.use('/api/operador', require('./routes/operadorRoutes'));

app.get('/', (req, res) => {
    res.send('Servidor de la Parroquia San Ignacio funcionando');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});