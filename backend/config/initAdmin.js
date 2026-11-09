const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const crearAdminPorDefecto = async () => {
  try {
    const adminExistente = await Usuario.findOne({ rol: 'admin' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin2026', salt);

    if (!adminExistente) {
      await Usuario.create({
        nombre: 'Administrador Principal',
        email: 'mendara2009@gmail.com',
        password: passwordHash,
        rol: 'admin',
        activo: true
      });

      console.log('El administrador está listo para usarse');
    } else {
      adminExistente.email = 'mendara2009@gmail.com';
      adminExistente.password = passwordHash;
      adminExistente.activo = true;
      await adminExistente.save();

      console.log('El administrador está listo para usarse');
    }
  } catch (error) {
    console.error('Error al inicializar el administrador:', error);
  }
};

module.exports = crearAdminPorDefecto;