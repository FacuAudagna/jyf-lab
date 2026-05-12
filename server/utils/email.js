const nodemailer = require('nodemailer');

// Singleton para el transporter
let transporter = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  // Si tenemos configurado un SMTP en .env (ej. Gmail, Sendgrid)
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  // Fallback para desarrollo: Cuenta de prueba automática de Ethereal Email
  console.log('Generando cuenta de prueba Ethereal para correos...');
  const testAccount = await nodemailer.createTestAccount();
  
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
};

const sendEmail = async (options) => {
  try {
    const mailTransporter = await createTransporter();
    
    const mailOptions = {
      from: '"JYF Lab" <no-reply@jyflab.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await mailTransporter.sendMail(mailOptions);
    
    console.log(`Mensaje enviado: ${info.messageId}`);
    
    // Si usamos ethereal, mostramos el link para ver el mail en consola
    if (!process.env.SMTP_HOST) {
      console.log(`✉️ Ver correo de prueba: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return true;
  } catch (error) {
    console.error('Error al enviar correo: ', error);
    return false;
  }
};

module.exports = { sendEmail };
