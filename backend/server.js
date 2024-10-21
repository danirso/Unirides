const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const { Carona, Usuario, CarInfo, PassageirosCaronas } = require("./models");
const { Op, where } = require("sequelize");

// Middleware para permitir JSON no body das requisições
app.use(express.json());

// Rota de API para buscar caronas disponíveis
app.get("/api/caronas", async (req, res) => {
  try {
    const caronas = await Carona.findAll({
      where: {
        vagas_disponiveis: { [Op.gt]: 0 },
        horario: { [Op.gte]: new Date() },
      },
      include: [
        { model: Usuario, as: "motorista", attributes: ["nome"] },
      ],
    });
    res.json(caronas);
  } catch (error) {
    console.error("Erro ao buscar caronas disponíveis:", error);
    res.status(500).send("Erro ao buscar caronas");
  }
});

//
app.get("/api/motorista/:id/caronas", async (req, res) => {
  const { id } = req.params;
  console.log("Requisição recebida para o motorista ID:", id);

  try {
    const caronasMotorista = await Carona.findAll({
      where: {
        id_motorista: id,
        horario: { [Op.gte]: new Date() },
      },
    });

    if (caronasMotorista.length === 0) {
      console.log("Nenhuma carona encontrada para o motorista ID:", id); // Log para verificar se há caronas
      return res
        .status(404)
        .json({ error: "Nenhuma carona encontrada para este motorista" });
    }

    res.json(caronasMotorista);
  } catch (error) {
    console.error("Erro ao buscar caronas do motorista:", error);
    res.status(500).send("Erro ao buscar caronas");
  }
});

// Rota para o motorista criar uma nova carona
app.post("/api/motorista/:id/caronas", async (req, res) => {
  const { id } = req.params; // ID do motorista
  const { destino, horario, partida, vagas, ar, musica } = req.body; // Dados da carona

  try {
    // Verifica se o usuário é um motorista
    const motorista = await Usuario.findOne({ where: { id, role: 1 } });
    if (!motorista) {
      return res.status(400).json({ error: "Usuário não é um motorista" });
    }

    // Cria a carona
    const novaCarona = await Carona.create({
      id_motorista: id,
      destino,
      horario,
      partida,
      vagas,
      vagas_disponiveis: vagas,
      ar,
      musica,
    });

    res
      .status(201)
      .json({ message: "Carona criada com sucesso!", carona: novaCarona });
  } catch (error) {
    console.error("Erro ao criar carona:", error);
    res.status(500).json({ error: "Erro ao criar carona" });
  }
});

// Rota para solicitar uma carona
app.put("/api/caronas/:id/solicitar", async (req, res) => {
  const { id } = req.params;
  const { id_passageiro } = req.body;

  try {
    const carona = await Carona.findByPk(id);

    if (!carona) {
      return res.status(404).json({ error: "Carona não encontrada" });
    }

    // Verifica se há vagas disponíveis
    if (carona.vagas_disponiveis <= 0) {
      return res.status(400).json({ error: "Não há vagas disponíveis" });
    }

    // Verifica se o passageiro já está na carona
    const passageiroExistente = await PassageirosCaronas.findOne({
      where: { id_passageiro, id_carona: id },
    });

    if (passageiroExistente) {
      return res.status(400).json({ error: "Você já está nesta carona" });
    }

    // Adiciona o passageiro à carona
    await PassageirosCaronas.create({
      id_passageiro,
      id_carona: id,
    });

    // Atualiza as vagas disponíveis
    carona.vagas_disponiveis -= 1;
    await carona.save();

    res.json({ message: "Carona solicitada com sucesso!" });
  } catch (error) {
    console.error("Erro ao solicitar carona:", error);
    res.status(500).json({ error: "Erro ao solicitar carona" });
  }
});

// Rota para buscar as caronas nas quais o passageiro está registrado
app.get("/api/caronas/minhas", async (req, res) => {
  const { id_passageiro } = req.query;

  try {
    const minhasCaronas = await Carona.findAll({
      include: [
        { model: Usuario, as: "motorista", attributes: ["nome"] },
        {
          model: Usuario,
          as: "passageiros",
          where: { id: id_passageiro },
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });

    res.json(minhasCaronas);
  } catch (error) {
    console.error("Erro ao buscar caronas do passageiro:", error);
    res.status(500).json({ error: "Erro ao buscar caronas do passageiro" });
  }
});

// Rota para o passageiro sair de uma carona
app.put("/api/caronas/:id/sair", async (req, res) => {
  const { id } = req.params;
  const { id_passageiro } = req.body;
  try {
    const carona = await Carona.findByPk(id);
    if (!carona) {
      return res.status(404).json({ error: "Carona não encontrada" });
    }

    const passageiroExistente = await PassageirosCaronas.findOne({
      where: { id_passageiro, id_carona: id },
    });

    if (!passageiroExistente) {
      return res.status(400).json({ error: "Você não está nesta carona" });
    }

    await PassageirosCaronas.destroy({
      where: { id_passageiro, id_carona: id },
    });

    carona.vagas_disponiveis += 1;
    await carona.save();

    res.json({ message: "Você saiu da carona com sucesso!" });
  } catch (error) {
    console.error("Erro ao sair da carona:", error);
    res.status(500).json({ error: "Erro ao sair da carona" });
  }
});

// Rota de API para cadastro de usuário
app.post("/signup", async (req, res) => {
  const { name, email, password, celular, ra, role, modelo, placa } = req.body;

  try {
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Usuário já existe com este email" });
    }

    const newUser = await Usuario.create({
      nome: name,
      email,
      senha: password,
      celular,
      ra,
      role,
    });

    if (role === 1) {
      await CarInfo.create({
        id_motorista: newUser.id,
        modelo,
        placa,
      });
    }

    res
      .status(201)
      .json({ message: "Usuário cadastrado com sucesso!", user: newUser });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

app.delete("/api/caronas/:id/cancelar", async (req, res) => {
  const { id } = req.params;

  try {
    const carona = await Carona.findByPk(id);

    if (!carona) {
      return res.status(404).json({ message: "Carona não encontrada." });
    }

    await carona.destroy(); // Deleta a carona do banco

    res.status(200).json({ message: "Carona cancelada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cancelar carona:", error);
    res.status(500).json({ error: "Erro ao cancelar carona" });
  }
});

// Rota de API para login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    if (usuario.senha !== password) {
      return res.status(401).json({ error: "Senha incorreta!" });
    }

    res.json({
      message: "Login bem-sucedido!",
      user: {
        id: usuario.id,
        nome: usuario.nome,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro interno no servidor!" });
  }
});

app.get("/api/historico/:userId/passageiro", async (req, res) => {
  const { userId } = req.params;

  try {
    const viagens = await Carona.findAll({
      where: {
        horario: { [Op.lt]: new Date() },
      },
      include: [
        {
          model: Usuario,
          as: "motorista",
          attributes: ["nome"],
        },
        {
          model: Usuario,
          as: "passageiros",
          where: { id: userId },
          attributes: ["id", "nome"],
          through: { attributes: [] },
        },
      ],
    });

    res.json(viagens);
  } catch (error) {
    console.error("Erro ao obter o histórico de caronas:", error);
    res.status(500).json({ error: "Erro ao obter o histórico de caronas" });
  }
});

app.get("/api/historico/:userId/motorista", async (req, res) => {
  const { userId } = req.params;

  try {
    const viagens = await Carona.findAll({
      where: {
        horario: { [Op.lt]: new Date() },
      },
      include: [
        {
          model: Usuario,
          as: "motorista",
          where: { id: userId },
          attributes: [],
        },
      ],
    });

    res.json(viagens);
  } catch (error) {
    console.error("Erro ao obter o histórico de caronas:", error);
    res.status(500).json({ error: "Erro ao obter o histórico de caronas" });
  }
});

// Servir os arquivos estáticos do build do React (produção)
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

// Rota coringa para servir o index.html do React (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
