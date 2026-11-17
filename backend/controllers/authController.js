// Controlador de autenticación, registro con aprobación por rol y recuperación de contraseña
const Operador = require('../models/Operador');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailer');

exports.registrarUsuario = async (req, res) => {
    const { nombres, apellidos, cedula, email, password, rol } = req.body;
    
    try {
        let operadorEmail = await Operador.findOne({ email });
        let usuarioEmail = await Usuario.findOne({ email });
        if (operadorEmail || usuarioEmail) return res.status(400).json({ msg: "El correo ya está registrado" });

        let operadorCedula = await Operador.findOne({ cedula });
        let usuarioCedula = await Usuario.findOne({ cedula });
        if (operadorCedula || usuarioCedula) return res.status(400).json({ msg: "Esta cédula ya se encuentra registrada" });

        const rolAsignado = rol || 'Secretario/a';

        const operador = new Operador({ 
            nombres, 
            apellidos, 
            cedula, 
            email, 
            password,
            rol: rolAsignado,
            activo: false 
        });

        const salt = await bcrypt.genSalt(10);
        operador.password = await bcrypt.hash(password, salt);

        await operador.save();

        const linkAceptar = `http://localhost:5000/api/auth/aprobar/${operador._id}`;
        const linkRechazar = `http://localhost:5000/api/auth/rechazar/${operador._id}`;

        const correoAdmin = 'mendara2009@gmail.com';
        const correoSecretarioFallback = 'marioendara09071995@hotmail.com';

        if (rolAsignado === 'Catequista') {
            const secretario = await Operador.findOne({ 
                rol: { $regex: /^secretario/i }, 
                activo: true 
            });

            const destinoSecretario = secretario ? secretario.email : correoSecretarioFallback;

            const mailSecretario = {
                from: `"Sistema Parroquial San Ignacio" <${correoAdmin}>`,
                to: destinoSecretario,
                subject: 'Solicitud de Registro - Nuevo Catequista',
                html: `
                    <h3>Nueva solicitud de registro en el sistema</h3>
                    <p><b>Nombre:</b> ${operador.nombres} ${operador.apellidos}</p>
                    <p><b>Cédula:</b> ${operador.cedula}</p>
                    <p><b>Correo:</b> ${operador.email}</p>
                    <p><b>Rol solicitado:</b> ${operador.rol}</p>
                    <br>
                    <p>Por favor elija una opción para autorizar el acceso del catequista:</p>
                    <a href="${linkAceptar}" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Aceptar</a>
                    <a href="${linkRechazar}" style="background-color: #c0392b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Rechazar</a>
                `
            };

            const mailInfoAdmin = {
                from: `"Sistema Parroquial San Ignacio" <${correoAdmin}>`,
                to: correoAdmin,
                subject: 'Nuevo registro en el sistema - Catequista',
                html: `
                    <h3>Nuevo registro en el sistema</h3>
                    <p><b>Nombre:</b> ${operador.nombres} ${operador.apellidos}</p>
                    <p><b>Cédula:</b> ${operador.cedula}</p>
                    <p><b>Correo:</b> ${operador.email}</p>
                    <p><b>Rol solicitado:</b> ${operador.rol}</p>
                `
            };

            try {
                await transporter.sendMail(mailSecretario);
                await transporter.sendMail(mailInfoAdmin);
            } catch (mailError) {
                console.error("Advertencia al enviar correos de catequista:", mailError.message);
            }

            return res.json({ msg: "Registro exitoso. Se envió la solicitud de aprobación a Secretaría." });
        } else {
            const mailOptions = {
                from: `"Sistema Parroquial San Ignacio" <${correoAdmin}>`,
                to: correoAdmin,
                subject: 'Solicitud de Registro - Nuevo Operador',
                html: `
                    <h3>Nueva solicitud de registro en el sistema</h3>
                    <p><b>Nombre:</b> ${operador.nombres} ${operador.apellidos}</p>
                    <p><b>Cédula:</b> ${operador.cedula}</p>
                    <p><b>Correo:</b> ${operador.email}</p>
                    <p><b>Rol solicitado:</b> ${operador.rol}</p>
                    <br>
                    <p>Por favor elija una opción:</p>
                    <a href="${linkAceptar}" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Aceptar</a>
                    <a href="${linkRechazar}" style="background-color: #c0392b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Rechazar</a>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (mailError) {
                console.error("Advertencia: No se pudo enviar el correo de notificación:", mailError.message);
            }

            return res.json({ msg: "Registro exitoso. Espere a que el administrador apruebe su cuenta." });
        }
    } catch (error) {
        console.error("Error detallado en registro:", error);
        res.status(500).json({ msg: 'Error al registrar el operador en el servidor' });
    }
};

exports.autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        let cuenta = await Operador.findOne({ email });
        
        if (!cuenta) {
            cuenta = await Usuario.findOne({ email });
        }

        if (!cuenta) return res.status(400).json({ msg: "Usuario no encontrado" });

        if (cuenta.activo === false) {
            return res.status(400).json({ msg: 'Su cuenta aún no ha sido autorizada.' });
        }

        const esCorrecto = await bcrypt.compare(password, cuenta.password);
        if (!esCorrecto) return res.status(400).json({ msg: "Contraseña incorrecta" });

        const rolAsignado = cuenta.rol || 'Usuario';

        const payload = { 
            usuario: { 
                id: cuenta.id,
                rol: rolAsignado
            } 
        };

        jwt.sign(payload, process.env.SECRETA, { expiresIn: '8h' }, (error, token) => {
            if (error) throw error;
            res.json({ 
                token, 
                rol: rolAsignado,
                nombres: cuenta.nombres 
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al autenticar');
    }
};

exports.recuperarPassword = async (req, res) => {
    const { email, cedula } = req.body;

    try {
        let cuenta = await Operador.findOne({ email, cedula });
        
        if (!cuenta) {
            cuenta = await Usuario.findOne({ email, cedula });
        }

        if (!cuenta) {
            return res.status(400).json({ 
                msg: "El correo ingresado no pertenece al usuario con esa cédula en el sistema" 
            });
        }

        const resetToken = jwt.sign(
            { id: cuenta._id, email: cuenta.email },
            process.env.SECRETA, 
            { expiresIn: '1h' }
        );

        const mailOptions = {
            from: '"Sistema Parroquial San Ignacio" <mendara2009@gmail.com>',
            to: cuenta.email,
            subject: "Recuperación de Contraseña",
            html: `
                <h3>Verificación de Identidad Exitosa</h3>
                <p>Hola ${cuenta.nombres}, haz clic en el enlace para cambiar tu clave:</p>
                <a href="http://localhost:3000/nuevo-password/${resetToken}">Restablecer Contraseña</a>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ msg: "Datos verificados. Enlace enviado a su correo electrónico." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al procesar la validación" });
    }
};

exports.nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password, email } = req.body;

    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        
        if (email !== cifrado.email) {
            return res.status(400).json({ 
                msg: "El correo de recuperación no es el mismo al registrado en el sistema" 
            });
        }

        let cuenta = await Operador.findById(cifrado.id) || await Usuario.findById(cifrado.id);

        if (!cuenta) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const salt = await bcrypt.genSalt(10);
        cuenta.password = await bcrypt.hash(password, salt);
        await cuenta.save();

        res.json({ msg: "La contraseña se ha actualizado correctamente" });

    } catch (error) {
        return res.status(400).json({ msg: 'El enlace es inválido o ha expirado' });
    }
};

exports.aprobarUsuario = async (req, res) => {
    try {
        await Operador.findByIdAndUpdate(req.params.id, { activo: true });
        res.send('<h1>Cuenta aprobada exitosamente. El operador ya puede iniciar sesión.</h1>');
    } catch (error) {
        res.status(500).send('Error al aprobar la cuenta');
    }
};

exports.rechazarUsuario = async (req, res) => {
    try {
        await Operador.findByIdAndDelete(req.params.id);
        res.send('<h1>Solicitud rechazada. El registro ha sido eliminado.</h1>');
    } catch (error) {
        res.status(500).send('Error al rechazar la cuenta');
    }
};