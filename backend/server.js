const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const { Carona, Usuario } = require('./models');

// Middleware para permitir JSON no body das requisições
app.use(express.json());

// Rota de API para buscar caronas disponíveis (sem passageiro)
app.get('/api/caronas', async (req, res) => {
  try {
    const caronas = await Carona.findAll({
      where: { id_passageiro: null },
      include: [
        { model: Usuario, as: 'passageiro', attributes: ['nome'] },
        { model: Usuario, as: 'motorista', attributes: ['nome'] },
      ],
    });
    res.json(caronas);
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
    const carona = await Carona.findByPk(id);
    if (!carona) {
      return res.status(404).json({ error: 'Carona não encontrada' });
    }

    if (carona.id_passageiro !== null) {
      return res.status(400).json({ error: 'Carona já tem um passageiro' });
    }

    carona.id_passageiro = id_passageiro;
    await carona.save();

    res.json({ message: 'Carona solicitada com sucesso!' });
  } catch (error) {
    console.error('Erro ao solicitar carona:', error);
    res.status(500).json({ error: 'Erro ao solicitar carona' });
  }
});

// Rota para buscar as caronas nas quais o passageiro está registrado
app.get('/api/caronas/minhas', async (req, res) => {
  const { id_passageiro } = req.query;

  try {
    const minhasCaronas = await Carona.findAll({
      where: { id_passageiro },
      include: [
        { model: Usuario, as: 'motorista', attributes: ['nome'] },
      ],
    });
    res.json(minhasCaronas);
  } catch (error) {
    console.error('Erro ao buscar caronas do passageiro:', error);
    res.status(500).json({ error: 'Erro ao buscar caronas do passageiro' });
  }
});

// Rota para o passageiro sair de uma carona
app.put('/api/caronas/:id/sair', async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar a carona pelo ID
    const carona = await Carona.findByPk(id);
    if (!carona) {
      return res.status(404).json({ error: 'Carona não encontrada' });
    }

    // Verificar se o passageiro realmente faz parte da carona
    if (carona.id_passageiro === null) {
      return res.status(400).json({ error: 'Você não está nesta carona' });
    }

    // Remover o passageiro da carona
    carona.id_passageiro = null;
    await carona.save();

    res.json({ message: 'Você saiu da carona com sucesso!' });
  } catch (error) {
    console.error('Erro ao sair da carona:', error);
    res.status(500).json({ error: 'Erro ao sair da carona' });
  }
});


// Rota de API para cadastro de usuário
app.post('/signup', async (req, res) => {
  const { name, email, password, celular, ra, role } = req.body;

  try {
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe com este email' });
    }

    const newUser = await Usuario.create({
      nome: name,
      email,
      senha: password,
      celular,
      ra,
      role,
    });

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
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    if (usuario.senha !== password) {
      return res.status(401).json({ error: 'Senha incorreta!' });
    }

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
