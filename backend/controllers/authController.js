// Controlador de autenticación y registro con manejo seguro de excepciones en correo
const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailer');

exports.registrarUsuario = async (req, res) => {
    const { nombres, apellidos, cedula, email, password, rol } = req.body;
    
    try {
        let usuarioEmail = await Usuario.findOne({ email });
        if (usuarioEmail) return res.status(400).json({ msg: "El correo ya está registrado" });

        let usuarioCedula = await Usuario.findOne({ cedula });
        if (usuarioCedula) return res.status(400).json({ msg: "Esta cédula ya se encuentra registrada" });

        const rolAsignado = rol || 'Secretario/a';

        const usuario = new Usuario({ 
            nombres, 
            apellidos, 
            cedula, 
            email, 
            password,
            rol: rolAsignado,
            activo: false 
        });

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();

        const linkAceptar = `http://localhost:5000/api/auth/aprobar/${usuario._id}`;
        const linkRechazar = `http://localhost:5000/api/auth/rechazar/${usuario._id}`;

        const mailOptions = {
            from: '"Sistema Parroquial San Ignacio" <tu-correo@gmail.com>',
            to: 'mendara2009@gmail.com',
            subject: 'Solicitud de Registro - Nuevo Operador / Personal',
            html: `
                <h3>Nueva solicitud de registro en el sistema</h3>
                <p><b>Nombre:</b> ${usuario.nombres} ${usuario.apellidos}</p>
                <p><b>Cédula:</b> ${usuario.cedula}</p>
                <p><b>Correo:</b> ${usuario.email}</p>
                <p><b>Rol solicitado:</b> ${usuario.rol}</p>
                <br>
                <p>Por favor elija una opción:</p>
                <a href="${linkAceptar}" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Aceptar</a>
                <a href="${linkRechazar}" style="background-color: #c0392b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Rechazar</a>
            `
        };

        // Intentamos enviar el correo de forma aislada para que no bloquee el registro si falla
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error("Advertencia: No se pudo enviar el correo de notificación:", mailError.message);
        }
        
        res.json({ msg: "Registro exitoso. Espere a que el administrador apruebe su cuenta." });
    } catch (error) {
        console.error("Error detallado en registro:", error);
        res.status(500).json({ msg: 'Error al registrar el usuario en el servidor' });
    }
};

exports.autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            usuario = await Persona.findOne({ email });
        }

        if (!usuario) return res.status(400).json({ msg: "Usuario no encontrado" });

        if (usuario.activo === false) {
            return res.status(400).json({ msg: 'Su cuenta aún no ha sido autorizada por el administrador.' });
        }

        const esCorrecto = await bcrypt.compare(password, usuario.password);
        if (!esCorrecto) return res.status(400).json({ msg: "Contraseña incorrecta" });

        const payload = { usuario: { id: usuario.id } };

        jwt.sign(payload, process.env.SECRETA, { expiresIn: '8h' }, (error, token) => {
            if (error) throw error;
            res.json({ token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al autenticar');
    }
};

exports.recuperarPassword = async (req, res) => {
    const { email, cedula } = req.body;

    try {
        let usuario = await Usuario.findOne({ email, cedula });
        
        if (!usuario) {
            usuario = await Persona.findOne({ email, cedula });
        }

        if (!usuario) {
            return res.status(400).json({ 
                msg: "El correo ingresado no pertenece al usuario con esa cédula en el sistema" 
            });
        }

        const resetToken = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.SECRETA, 
            { expiresIn: '1h' }
        );

        const mailOptions = {
            from: '"Sistema Parroquial San Ignacio" <tu-correo@gmail.com>',
            to: usuario.email,
            subject: "Recuperación de Contraseña",
            html: `
                <h3>Verificación de Identidad Exitosa</h3>
                <p>Hola ${usuario.nombres}, haz clic en el enlace para cambiar tu clave:</p>
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

        let usuario = await Usuario.findById(cifrado.id) || await Persona.findById(cifrado.id);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        await usuario.save();

        res.json({ msg: "La contraseña se ha actualizado correctamente" });

    } catch (error) {
        return res.status(400).json({ msg: 'El enlace es inválido o ha expirado' });
    }
};

exports.aprobarUsuario = async (req, res) => {
    try {
        await Usuario.findByIdAndUpdate(req.params.id, { activo: true });
        res.send('<h1>Cuenta aprobada exitosamente. El usuario ya puede iniciar sesión.</h1>');
    } catch (error) {
        res.status(500).send('Error al aprobar la cuenta');
    }
};

exports.rechazarUsuario = async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.send('<h1>Solicitud rechazada. El registro ha sido eliminado.</h1>');
    } catch (error) {
        res.status(500).send('Error al rechazar la cuenta');
    }
};