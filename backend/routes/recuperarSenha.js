const express = require('express');
const bcrypt = require('bcryptjs');
const enviarCodigo = require('../utils/enviar_codigo'); // Função para enviar o código por email
const db = require('../models'); // ORM para interagir com o banco de dados (ex.: Sequelize)
const router = express.Router();

// Middleware para validar se o email está presente
const validarEmail = (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ message: 'Email é obrigatório.' });
    }
    next();  // Se o email estiver presente, passa para a próxima função
};

const validarSenhas = (req, res, next) => {
    const { novaSenha, confirmarSenha } = req.body;
    if (!novaSenha || !confirmarSenha) {
        return res.status(400).json({ message: 'As senhas são obrigatórias.' });
    }
    if (novaSenha !== confirmarSenha) {
        return res.status(400).json({ message: 'As senhas precisam ser iguais.' });
    }
    next();
};


// POST: Enviar o código de recuperação
router.post('/recuperar-senha', validarEmail, async (req, res) => {
    const { email } = req.body;
    console.log('Requisição recebida para /recuperar-senha', req.body);

    try {
        // Gerar código aleatório de 6 dígitos e definir validade de 10 minutos
        const codigo = Math.floor(100000 + Math.random() * 900000);
        const expiracao = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos a partir de agora

        // Verificar se o email existe na base de dados
        const usuario = await db.Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ message: 'Email não encontrado.' });
        }

        // Salvar código no banco
        await db.CodigosRecuperacao.upsert({ email, codigo, expiracao }); // Evita duplicações

        // Enviar email com o código
        await enviarCodigo(email, codigo);

        res.status(200).json({ message: 'Código enviado para o email informado.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar o código de recuperação.' });
    }
});

// POST: Verificar o código
router.post('/verificar-codigo', validarEmail, async (req, res) => {
    const { email, codigo } = req.body;

    try {
        // Buscar o código no banco
        const registro = await db.CodigosRecuperacao.findOne({ where: { email, codigo } });

        if (!registro) {
            return res.status(400).json({ message: 'Código inválido.' });
        }

        // Verificar validade do código
        if (new Date() > registro.expiracao) {
            return res.status(400).json({ message: 'Código expirado.' });
        }

        res.status(200).json({ message: 'Código válido!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao verificar o código.' });
    }
});

// POST: Trocar a senha
router.post('/trocar-senha', validarEmail, validarSenhas, async (req, res) => {
    const { email, novaSenha, confirmarSenha } = req.body;

    try {

        if (novaSenha !== confirmarSenha) {
            return res.status(400).json({ message: 'As senhas precisam ser iguais.' });
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(novaSenha, 10);

        // Atualizar a senha no banco de dados
        const usuarioAtualizado = await db.Usuario.update(
            { senha: hashedPassword },
            { where: { email } }
        );

        if (!usuarioAtualizado[0]) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao alterar a senha.' });
    }
});

module.exports = router;
