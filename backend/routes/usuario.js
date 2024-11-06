const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');

// Rota para cadastro de usuário
router.post('/api/signup', async (req, res) => {
    try {
        console.log(req.body); // Para verificar os dados recebidos
        const { nome, email, celular, ra, password, role, modeloCarro, placaCarro} = req.body;

        // Criar um novo usuário usando o modelo Usuario
        const novoUsuario = await Usuario.create({
            nome,
            email,
            celular,
            ra,
            password, // Certifique-se de que a senha esteja sendo tratada corretamente
            role,
            ...(role === '1' && { modeloCarro, placaCarro }),
        });

        res.status(201).json(novoUsuario); // Retornar o novo usuário como resposta
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});

// Rota para atualizar informações do usuário
router.put('/api/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID do usuário a ser atualizado
        const { nome, email, celular, ra, modeloCarro, placaCarro, role} = req.body;

        const updateData = {
            nome,
            email,
            celular,
            ra,
            ...(role === '1' && { modeloCarro, placaCarro }),
        };
        
        // Atualizar o usuário no banco de dados
        const [updated] = await Usuario.update(
            updateData,
            {
                where: { id },
            }
        );

        if (updated) {
            const updatedUsuario = await Usuario.findOne({ where: { id } });
            return res.status(200).json(updatedUsuario);
        }

        throw new Error('Usuário não encontrado');
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
});

// Rota para obter informações do usuário por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (usuario) {
            const responseData = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                celular: usuario.celular,
                ra: usuario.ra,
                ...(usuario.role === '1' && {
                    modeloCarro: usuario.modeloCarro,
                    placaCarro: usuario.placaCarro,
                }), // Inclui apenas se for motorista
            };
            return res.status(200).json(responseData); // Retorna todas as informações do usuário
        }

        return res.status(404).json({ message: 'Usuário não encontrado' });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
});

module.exports = router;
