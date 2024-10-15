const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // Alterado para evitar conflito com o React Dev Server
const { Carona, Usuario } = require('./models'); // Importar seus modelos

// Middleware para permitir JSON no body das requisições
app.use(express.json());

// Rota de API para buscar caronas
app.get('/api/caronas', async (req, res) => {
  try {
    const caronas = await Carona.findAll({
      include: [
        { model: Usuario, as: 'passageiro', attributes: ['nome'] },
        { model: Usuario, as: 'motorista', attributes: ['nome'] }, // Pegando o nome do motorista
      ],
    });
    res.json(caronas); // Enviar as caronas como resposta JSON
  } catch (error) {
    console.error('Erro ao buscar caronas:', error);
    res.status(500).send('Erro ao buscar caronas');
  }
});

app.post('/api/signup', async (req, res) => {
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

// Servir os arquivos estáticos do build do React (produção)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Rota coringa para servir o index.html do React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
