const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Conectar a la Base de Datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json()); // Solo una vez es suficiente

// Rutas
app.use('/api/personas', require('./routes/personaRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bautismo', require('./routes/bautismoRoutes'));
app.use('/api/catequesis', require('./routes/catequesisRoutes'));
app.use('/api/matrimonio', require('./routes/matrimonio'));

app.get('/', (req, res) => {
    res.send('Servidor de la Parroquia San Ignacio funcionando 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});