const Operador = require('../models/Operador');
const bcrypt = require('bcryptjs');

const crearAdminPorDefecto = async () => {
    try {
        const adminExistente = await Operador.findOne({ rol: 'Administrador' });
        if (!adminExistente) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('mario123', salt);

            const nuevoAdmin = new Operador({
                nombres: 'Administrador',
                apellidos: 'Principal',
                cedula: '0992504616',
                email: 'mendara2009@gmail.com',
                password: passwordHash,
                rol: 'Administrador',
                activo: true
            });

            await nuevoAdmin.save();
            console.log('Administrador por defecto creado exitosamente en Operadores');
        }
    } catch (error) {
        console.error('Error al inicializar el administrador:', error);
    }
};

module.exports = crearAdminPorDefecto;