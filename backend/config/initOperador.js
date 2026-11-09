const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const crearOperadoresPorDefecto = async () => {
  try {
    const operadores = [
      { nombre: 'Secretario Principal', email: 'secretario@parroquia.com', rol: 'Secretario/a' },
      { nombre: 'Coordinador Catequesis', email: 'coordinador@parroquia.com', rol: 'Coordinador de catequesis' },
      { nombre: 'Catequista Principal', email: 'catequista@parroquia.com', rol: 'Catequista' }
    ];

    for (const op of operadores) {
      const existe = await Usuario.findOne({ email: op.email });

      if (!existe) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('Operador2026*', salt);

        await Usuario.create({
          nombre: op.nombre,
          email: op.email,
          password: passwordHash,
          rol: op.rol
        });
      }
    }

    console.log('Los operadores están listos para usarse');
  } catch (error) {
    console.error('Error al inicializar los operadores:', error);
  }
};

module.exports = crearOperadoresPorDefecto;