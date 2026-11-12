// Middleware para validar que el usuario autenticado posea uno de los roles autorizados
const jwt = require('jsonwebtoken');

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // Leer el token del header (soporta 'x-auth-token' o 'Authorization: Bearer ...')
        const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ msg: 'No hay token, permiso denegado' });
        }

        try {
            // Verificar el token
            const cifrado = jwt.verify(token, process.env.SECRETA);
            req.usuario = cifrado.usuario;

            // El Administrador siempre tiene acceso total al sistema
            if (req.usuario.rol === 'Administrador') {
                return next();
            }

            // Verificar si el rol del usuario está dentro de los permitidos para esta ruta
            if (!rolesPermitidos.includes(req.usuario.rol)) {
                return res.status(403).json({ 
                    msg: `Acceso denegado. Se requiere perfil: ${rolesPermitidos.join(' o ')}` 
                });
            }

            next();
        } catch (error) {
            res.status(401).json({ msg: 'Token no válido o expirado' });
        }
    };
};

module.exports = verificarRol;