const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');

router.post('/api/signup', async (req, res) => {
    try {
      console.log(req.body); // Para verificar os dados recebidos
      const { nome, email, celular, ra, role } = req.body;
  
      // Criar um novo usuário usando o modelo Usuario
      const novoUsuario = await Usuario.create({
        nome,
        email,
        celular,
        ra,
        password,
        role,
      });
  
      res.status(201).json(novoUsuario); // Retornar o novo usuário como resposta
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});