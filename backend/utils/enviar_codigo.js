const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ou seu provedor
    auth: {
        user: 'seu-email@gmail.com',
        pass: 'sua-senha-de-aplicativo', // Substitua por uma senha de aplicativo
    },
});

async function enviarCodigo(email, codigo) {
    const mailOptions = {
        from: 'seu-email@gmail.com',
        to: email,
        subject: 'Código de Recuperação de Senha',
        text: `Seu código de verificação é: ${codigo}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email enviado para ${email}`);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
}

module.exports = enviarCodigo;
