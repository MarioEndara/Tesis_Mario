const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Usa SSL
    auth: {
        user: 'mendara2009@gmail.com',
        pass: 'gsoa uved zxsy xsof'    
    },
    // ESTA PARTE ES LA QUE SOLUCIONA TU ERROR:
    tls: {
        rejectUnauthorized: false
    }
});

// Verificación para estar 100% seguros en la terminal
transporter.verify().then(() => {
    console.log('✅ Servidor de correos conectado y saltando certificados');
}).catch((err) => {
    console.log('❌ Error persistente en mailer:', err);
});

module.exports = transporter;