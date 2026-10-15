const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailer');

// Registra un nuevo administrativo/usuario con todos los campos de la parroquia
exports.registrarUsuario = async (req, res) => {
    // Agregamos todos los campos que vienen del formulario
    const { nombres, apellidos, cedula, direccion, fechaNacimiento, email, password, padres } = req.body;
    
    try {
        // 1. Verificar si el email ya existe
        let usuarioEmail = await Usuario.findOne({ email });
        if (usuarioEmail) return res.status(400).json({ msg: "El correo ya está registrado" });

        // 2. Verificar si la CÉDULA ya existe (Lo que pediste: que sea única)
        let usuarioCedula = await Usuario.findOne({ cedula });
        if (usuarioCedula) return res.status(400).json({ msg: "Esta cédula ya se encuentra registrada" });

        // 3. Crear el usuario con la estructura completa
        const usuario = new Usuario({ 
            nombres, 
            apellidos, 
            cedula, 
            direccion, 
            fechaNacimiento, 
            email, 
            password,
            padres // Esto guarda el objeto con nombrePadre, nombreMadre y contacto
        });

        // 4. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // 5. Guardar en la base de datos
        await usuario.save();
        
        res.json({ msg: "Usuario registrado correctamente en el sistema parroquial" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
};

// Valida credenciales y entrega de token (acceso)
exports.autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Buscamos primero en Usuario (Administrativo)
        let usuario = await Usuario.findOne({ email });
        
        // 2. Si no es administrativo, buscamos en Persona (Feligrés)
        if (!usuario) {
            usuario = await Persona.findOne({ email });
        }

        // 3. Si no está en ninguno de los dos, error
        if (!usuario) return res.status(400).json({ msg: "Usuario no encontrado" });

        // 4. Comparar la contraseña
        const esCorrecto = await bcrypt.compare(password, usuario.password);
        if (!esCorrecto) return res.status(400).json({ msg: "Contraseña incorrecta" });

        // 5. Generar el token (usando tu estructura original)
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
// Envía un correo electrónico para recuperar la contraseña (Versión para pruebas con simulación)
exports.recuperarPassword = async (req, res) => {
    // Recibimos correo y cédula desde el frontend
    const { email, cedula } = req.body;

    try {
        // 1. Buscamos al usuario que cumpla con AMBAS condiciones
        let usuario = await Usuario.findOne({ email, cedula });
        
        if (!usuario) {
            usuario = await Persona.findOne({ email, cedula });
        }

        // 2. Si no coincide la combinación, lanzamos el error y CORTAMOS (return)
        if (!usuario) {
            return res.status(400).json({ 
                msg: "El correo ingresado no pertenece al usuario con esa cédula en el sistema" 
            });
        }

        // 3. Solo si los datos son correctos, generamos el token
        const resetToken = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.SECRETA, 
            { expiresIn: '1h' }
        );

        // 4. Enviamos el correo
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
// Permite al usuario establecer una nueva contraseña mediante el token
exports.nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password, email } = req.body; // Recibimos el email del formulario

    try {
        // 1. Verificar el token
        const cifrado = jwt.verify(token, process.env.SECRETA);
        
        // 2. VALIDACIÓN CLAVE: ¿El correo que escribió es el mismo del token?
        if (email !== cifrado.email) {
            return res.status(400).json({ 
                msg: "El correo de recuperación no es el mismo al registrado en el sistema" 
            });
        }

        // 3. Si coincide, buscamos al usuario
        let usuario = await Usuario.findById(cifrado.id) || await Persona.findById(cifrado.id);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // 4. Cifrar y guardar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        await usuario.save();

        res.json({ msg: "La contraseña se ha actualizado correctamente" });

    } catch (error) {
        return res.status(400).json({ msg: 'El enlace es inválido o ha expirado' });
    }
};