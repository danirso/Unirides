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
      where: { id_passageiro: null }, // Apenas caronas sem passageiro
      include: [
        { model: Usuario, as: 'motorista', attributes: ['nome'] }, // Pega o nome do motorista
      ],
    });
    res.json(caronas); // Enviar as caronas como resposta JSON
  } catch (error) {
    console.error('Erro ao buscar caronas:', error);
    res.status(500).send('Erro ao buscar caronas');
  }
});

// Rota para solicitar uma carona
app.put('/api/caronas/:id/solicitar', async (req, res) => {
  const { id } = req.params;
  const { id_passageiro } = req.body;

  try {
    // Buscar a carona pelo ID
    const carona = await Carona.findByPk(id);
    if (!carona) {
      return res.status(404).json({ error: 'Carona não encontrada' });
    }

    // Verificar se a carona já tem um passageiro
    if (carona.id_passageiro !== null) {
      return res.status(400).json({ error: 'Carona já tem um passageiro' });
    }

    // Atualizar a carona com o ID do passageiro
    carona.id_passageiro = id_passageiro;
    await carona.save();

    res.json({ message: 'Carona solicitada com sucesso!' });
  } catch (error) {
    console.error('Erro ao solicitar carona:', error);
    res.status(500).json({ error: 'Erro ao solicitar carona' });
  }
});

// Rota de API para cadastro de usuário
app.post('/signup', async (req, res) => {
  const { name, email, password, celular, ra, role } = req.body;

  try {
    // Verificar se o usuário já existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe com este email' });
    }

    // Criar novo usuário (sem criptografia de senha)
    const newUser = await Usuario.create({
      nome: name,
      email,
      senha: password, // Senha sem criptografia
      celular,
      ra,
      role, // 0: passageiro, 1: motorista
    });

    // Retornar sucesso
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Rota de API para login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o email existe no banco de dados
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Verificar se a senha fornecida está correta
    if (usuario.senha !== password) {
      return res.status(401).json({ error: 'Senha incorreta!' });
    }

    // Se o login for bem-sucedido, enviar dados do usuário
    res.json({
      message: 'Login bem-sucedido!',
      user: {
        id: usuario.id,
        nome: usuario.nome,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ error: 'Erro interno no servidor!' });
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
