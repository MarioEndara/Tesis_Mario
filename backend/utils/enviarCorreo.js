const nodemailer = require('nodemailer');

const enviarCorreoAprobacion = async (nuevoUsuario) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CORREO_ADMIN_SENDER,
            pass: process.env.PASSWORD_APP_EMAIL
        }
    });

    const linkAceptar = `http://localhost:5000/api/auth/aprobar/${nuevoUsuario._id}`;
    const linkRechazar = `http://localhost:5000/api/auth/rechazar/${nuevoUsuario._id}`;

    const mailOptions = {
        from: process.env.CORREO_ADMIN_SENDER,
        to: 'mendara2009@gmail.com',
        subject: 'Solicitud de Registro - Nuevo Operador / Personal',
        html: `
            <h3>Nueva solicitud de registro en el sistema</h3>
            <p><b>Nombre:</b> ${nuevoUsuario.nombre}</p>
            <p><b>Correo:</b> ${nuevoUsuario.email}</p>
            <p><b>Rol solicitado:</b> ${nuevoUsuario.rol}</p>
            <br>
            <p>Por favor elija una opción:</p>
            <a href="${linkAceptar}" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Aceptar</a>
            <a href="${linkRechazar}" style="background-color: #c0392b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Rechazar</a>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = enviarCorreoAprobacion;