const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const { Carona, Code, Usuario, CarInfo, PassageirosCaronas,Avaliacoes,MensagemCarona } = require("./models");
const { Op, where, Model,Sequelize } = require("sequelize");
const http = require('http');
const cors = require('cors');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const router = express.Router();
require('dotenv').config({ path: './backend/.env' });
const bodyParser = require('body-parser');

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // URL do frontend
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/test", (req, res) => {
  res.json({ message: "all working, buddy" });
});

const userSocketMap = {};
io.on("connection", (socket) => {
  
  socket.on("registrarUsuario", ({ userId }) => {
    userSocketMap[userId] = socket.id;
});

  console.log("Usuário conectado:", socket.id);

  // Entrar na sala da carona específica
  socket.on("entrarCarona", async (caronaId, usuario) => {
    try {
      let carona;
      if (usuario.role === 1) {
        carona = await Carona.findByPk(caronaId, {
          where: { id_motorista: usuario.id },
        });
      } else {
        carona = await PassageirosCaronas.findOne({
          where: {
            id_passageiro: usuario.id,
            id_carona: caronaId,
          },
        });
      }

      if (carona) {
        socket.join(caronaId);
        socket.caronaId = caronaId;
        socket.usuario = usuario;

        console.log(`Usuário ${usuario.name} entrou na carona ${caronaId}`);

        // Busca o histórico e inclui o autor da mensagem
        const historico = await MensagemCarona.findAll({
          where: { caronaId: caronaId },
          order: [["createdAt", "ASC"]],
          include: [{ model: Usuario, as: "autor", attributes: ["nome"] }], // Inclui o nome do autor
        });

        console.log(
          "Histórico de Mensagens:",
          JSON.stringify(historico, null, 2)
        ); // Exibe a estrutura completa
        socket.emit("historicoMensagens", historico);

        socket.emit("historicoMensagens", historico);
      } else {
        console.log(
          `Usuário ${usuario.name} não pertence à carona ${caronaId}`
        );
      }
    } catch (error) {
      console.error("Erro ao verificar carona ou carregar histórico:", error);
    }
  });

  // Escuta quando uma mensagem é enviada
  socket.on("mensagem", async (data) => {
    const { caronaId, mensagem, usuario, usuarioId, nome } = data;

    if (socket.caronaId === caronaId) {
      console.log("Mensagem recebida:", data);

      // Salva a mensagem no banco de dados
      await MensagemCarona.create({
        caronaId,
        usuarioId,
        mensagem,
      });

      io.to(caronaId).emit("mensagem", {
        mensagem,
        usuario,
        usuarioId,
        caronaId,
        nome,
      });
    } else {
      console.log(
        "Tentativa de envio de mensagem para carona incorreta:",
        data
      );
    }
  });

  // Escuta a desconexão
  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
            delete userSocketMap[userId];
            break;
        }
    }
});
  // Lógica de notificação para os passageiros no servidor
  socket.on("notificarPassageiro", async ({ caronaId, motorista }) => {
    try {
      // Encontrar todos os passageiros da carona
      const passageiros = await PassageirosCaronas.findAll({
        where: { id_carona: caronaId },
        include: [
          { model: Usuario, as: "passageiro", attributes: ["id", "nome"] },
        ],
      });

      if (passageiros.length > 0) {
        passageiros.forEach((passageiro) => {
          const socketId = userSocketMap[passageiro.passageiro.id];
          if (socketId) {
              io.to(socketId).emit("motoristaAcaminho", {
                  mensagem: `${motorista} saiu para o local combinado e está a caminho!`,
              });
            }
          })
        console.log("Notificação enviada para todos os passageiros.");
      } else {
        console.error("Nenhum passageiro encontrado para esta carona.");
      }
    } catch (error) {
      console.error("Erro ao enviar notificação para os passageiros:", error);
    }
  });

  // Evento para notificar quando o motorista chegou no local
  socket.on("motoristaChegou", async ({ caronaId, motorista }) => {
    try {
      // Encontrar todos os passageiros da carona
      const passageiros = await PassageirosCaronas.findAll({
        where: { id_carona: caronaId },
        include: [
          { model: Usuario, as: "passageiro", attributes: ["id", "nome"] },
        ],
      });

      if (passageiros.length > 0) {
        passageiros.forEach((passageiro) => {
          const socketId = userSocketMap[passageiro.passageiro.id];
          if (socketId) {
              io.to(socketId).emit("motoristaChegouNotificacao", {
                  mensagem: `${motorista} chegou ao local combinado!`,
              });
            }
          })
        console.log(
          "Notificação de chegada enviada para todos os passageiros."
        );
      } else {
        console.error("Nenhum passageiro encontrado para esta carona.");
      }
    } catch (error) {
      console.error(
        "Erro ao enviar notificação de chegada para os passageiros:",
        error
      );
    }
  });
});

server.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});

// Middleware para permitir JSON no body das requisições
app.use(express.json());

const usuarioRoutes = require("./routes/usuario");

app.use("/api/usuario", usuarioRoutes);


app.get("/api/caronas", async (req, res) => {
  try {
    const userId = req.query.userId;
    const caronas = await Carona.findAll({
      where: {
        vagas_disponiveis: { [Op.gt]: 0 },
        horario: { [Op.gte]: new Date() },
        ...(userId && {
          [Op.and]: [
            Sequelize.literal(`NOT EXISTS (
              SELECT 1 
              FROM PassageirosCaronas 
              WHERE 
                PassageirosCaronas.id_carona= Carona.id 
                AND PassageirosCaronas.id_passageiro = ${userId}
            )`)
          ]
        })
      },
      include: [
        {
          model: Usuario,
          as: "motorista",
          attributes: ["nome"],
          include: [
            {
              model: Avaliacoes,
              as: "avaliacoes",
              attributes: ["media"],
            },
          ],
        },
      ],
    });

    res.json(caronas);
  } catch (error) {
    console.error("Erro ao buscar caronas disponíveis:", error);
    res.status(500).send("Erro ao buscar caronas");
  }
});

//Atualiza o status do motorista para gerar a notificação de aviso
app.put("/caronas/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status_motorista } = req.body;

  try {
    // Atualiza o status no banco de dados
    const [rowsUpdated, [caronaAtualizada]] = await Carona.update(
      { status_motorista },
      {
        where: { id },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "Carona não encontrada." });
    }

    // Emitir evento via Socket.IO
    const io = req.app.get("socketio");
    io.emit("caronaAtualizada", {
      id: caronaAtualizada.id,
      status_motorista: caronaAtualizada.status_motorista,
    });

    res.status(200).json({
      message: "Status atualizado com sucesso.",
      carona: caronaAtualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar o status." });
  }
});

app.get("/api/motorista/:id/caronas", async (req, res) => {
  const { id } = req.params;
  console.log("Requisição recebida para o motorista ID:", id);

  try {
    const caronasMotorista = await Carona.findAll({
      where: {
        id_motorista: id,
        horario: { [Op.gte]: new Date() },
      },
      include: [
        {
          model: Usuario,
          as: "passageiros",
          attributes: ["nome"],
          include: [
            {
              model: Avaliacoes,
              as: "avaliacoes",
              attributes: ["media"],
            },
          ],
        },
      ],
    });

    if (caronasMotorista.length === 0) {
      console.log("Nenhuma carona encontrada para o motorista ID:", id);
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

// Rota de API para buscar detalhes da carona
app.get("/api/detalhes/:id/caronas", async (req, res) => {
  try {
    const caronaId = req.params.id;
    const carona = await Carona.findOne({
      where: { id: caronaId },
      include: [
        {
          model: Usuario,
          as: "passageiros",
          attributes: ["nome"],
          include: [
            {
              model: Avaliacoes,
              as: "avaliacoes",
              attributes: ["media"],
            },
          ],
        },
        {
          model: Usuario,
          as: "motorista",
          attributes: ["nome"], // Inclui o nome do motorista para exibir na página
        },
      ],
    });

    if (!carona) {
      return res.status(404).json({ error: "Carona não encontrada" });
    }

    res.json(carona);
  } catch (error) {
    console.error("Erro ao buscar detalhes da carona:", error);
    res.status(500).send("Erro ao buscar detalhes da carona");
  }
});

app.get("/api/detalhesp/:id/caronas", async (req, res) => {
  try {
    const caronaId = req.params.id;
    const carona = await Carona.findOne({
      where: { id: caronaId },
      include: [
        {
          model: Usuario,
          as: "motorista",
          attributes: ["nome"],
          include: [
            {
              model: Avaliacoes,
              as: "avaliacoes",
              attributes: ["media","texto_avaliativo"],
            },
            {
              model: CarInfo,
              as:"veiculo",
            }
          ],
        },
        
      ],
    });
    if (!carona) {
      return res.status(404).json({ error: "Carona não encontrada" });
    }

    res.json(carona);
  } catch (error) {
    console.error("Erro ao buscar detalhes da carona:", error);
    res.status(500).send("Erro ao buscar detalhes da carona");
  }
});

// Rota para o motorista criar uma nova carona
app.post("/api/motorista/:id/caronas", async (req, res) => {
  const { id } = req.params;
  const { destino, horario, partida, vagas, ar, musica } = req.body;

  try {
    const motorista = await Usuario.findOne({ where: { id, role: 1 } });
    if (!motorista) {
      return res.status(400).json({ error: "Usuário não é um motorista" });
    }

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

    if (carona.vagas_disponiveis <= 0) {
      return res.status(400).json({ error: "Não há vagas disponíveis" });
    }

    const passageiroExistente = await PassageirosCaronas.findOne({
      where: { id_passageiro, id_carona: id },
    });

    if (passageiroExistente) {
      return res.status(400).json({ error: "Você já está nesta carona" });
    }

    await PassageirosCaronas.create({
      id_passageiro,
      id_carona: id,
    });

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
      where: {
        horario: { [Op.gte]: new Date() },
      },
      include: [
        { model: Usuario, as: "motorista", attributes: ["nome"],include: [
          {
            model: Avaliacoes,
            as: "avaliacoes",
            attributes: ["media"],
          },
        ],  },
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
  const { name, email, password, celular, ra, role, modeloCarro, placa } =
    req.body;

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
        modelo: modeloCarro,
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

    await carona.destroy();

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

app.use(cors());
app.use(bodyParser.json());

// Função para gerar código de recuperação aleatório
const gerarCodigoRecuperacao = () => {
  return Math.floor(100000 + Math.random() * 900000); // Gera um código de 6 dígitos
};

// Função para enviar o código por e-mail
const enviarEmail = (email, codigo) => {
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // Servidor SMTP do Gmail
      port: 465,
      secure: true,
      auth: {
        user: 'sistemadecaronasunirides@gmail.com', 
        pass: 'lygh vlzi suze tiqv', 
      },
    });

return transporter.sendMail({
  from: `Sistema de Caronas <${process.env.GMAIL_USER}>`,  // Seu e-mail como remetente
  to: email,  // E-mail do destinatário
  subject: 'Código de Recuperação de Senha',  // Assunto do e-mail
  text: `Seu código de verificação é: ${codigo}\n\nEste código expira em 10 minutos.`,  // Corpo do e-mail
}).then(() => {
  console.log('E-mail enviado com sucesso!');
}).catch((error) => {
  console.error('Erro ao enviar e-mail:', error);
});
};

// Rota para solicitar a recuperação de senha (passo 1)
app.post('/recuperar-senha', async (req, res) => {
  try {
      const { email } = req.body;

      // Adicione logs aqui para depurar
      console.log("Recebido email:", email);
      
      if (!email) {
          console.log("Erro: email não fornecido");
          return res.status(400).json({ message: "Email é obrigatório." });
      }

      // Verifique se o email existe no banco
      const user = await Usuario.findOne({ where: { email } });
      console.log("Usuário encontrado:", user);

      if (!user) {
          console.log("Erro: email não encontrado no banco");
          return res.status(404).json({ message: "Email não encontrado." });
      }

      // Gere o código de verificação
      const verificationCode = gerarCodigoRecuperacao();
      console.log("Código gerado:", verificationCode);

      // Salve o código no banco ou memória
      await Code.create({
        id_usuario: user.id,
        code: verificationCode,
        expiryDate: new Date(Date.now() + 10 * 60 * 1000),  // Expira em 10 minutos
      });
      
      // Enviar email (adicione sua lógica aqui)
      await enviarEmail(email, verificationCode);

      return res.status(200).json({ message: "Código enviado com sucesso!" });
  } catch (error) {
      console.error("Erro ao processar a recuperação de senha:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
  }
});


// Rota para validar o código de recuperação (passo 2)
app.post('/verificar-codigo', async (req, res) => {
  const { email, codigo } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o código de recuperação corresponde e se não expirou
    if (usuario.verificationCode !== codigo) {
      return res.status(400).json({ message: 'Código inválido.' });
    }

    const agora = new Date();
    if (agora > Usuario.verificationCodeExpiry) {
      return res.status(400).json({ message: 'Código expirado.' });
    }

    // O código é válido, permite redefinir a senha
    return res.status(200).json({ message: 'Código validado com sucesso!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao validar o código.' });
  }
});

// Rota para redefinir a senha (passo 3)
app.post('/trocar-senha', async (req, res) => {
  const { email, novaSenha } = req.body;

  try {
    // Validação: verificar se a senha atende aos critérios
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!regex.test(novaSenha)) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial."
      });
    }

    // Encontrar o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    // Atualizar a senha e limpar os códigos de verificação
    usuario.senha = hashedPassword;
    usuario.verificationCode = null;  // Limpar o código de verificação
    usuario.verificationCodeExpiry = null;  // Limpar a expiração
    await usuario.save();

    return res.status(200).json({ message: "Senha redefinida com sucesso!" });

  } catch (error) {
    console.error("Erro ao redefinir a senha:", error);
    return res.status(500).json({ message: "Erro ao redefinir a senha." });
  }
});

app.get("/api/historico/:userId/passageiro", async (req, res) => {
  const { userId } = req.params;

  try {
    const caronasPassageiro = await Carona.findAll({
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
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });

    res.json(caronasPassageiro);
  } catch (error) {
    console.error("Erro ao buscar histórico de caronas do passageiro:", error);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

app.get("/api/historico/:userId/motorista", async (req, res) => {
  const { userId } = req.params;

  try {
    const caronasMotorista = await Carona.findAll({
      where: {
        id_motorista: userId,
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
          attributes: ["id", "nome"],
          through: { attributes: [] },
        },
      ],
    });
    res.json(caronasMotorista);
  } catch (error) {
    console.error("Erro ao buscar histórico de caronas do motorista:", error);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

// Rota para buscar informações de um usuário específico
app.get("/api/usuario/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      return res.status(200).json(usuario);
    }
    return res.status(404).json({ message: "Usuário não encontrado" });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
});

// Rota para buscar informações carro
app.get("/api/CarInfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const Carro = await CarInfo.findOne({
      where: {
        id_motorista: id,
      },
    });
    if (!Carro) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }
    res.json(Carro);
  } catch (error) {
    console.error("Erro ao buscar dados do carro:", error);
    res.status(500).json({ error: "Erro ao buscar dados do carro" });
  }
});

// Rota de API para atualizar informações do usuário
app.put("/api/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, celular, ra } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    usuario.celular = celular || usuario.celular;
    usuario.ra = ra || usuario.ra;

    await usuario.save();

    res
      .status(200)
      .json({ message: "Informações atualizadas com sucesso!", usuario });
  } catch (error) {
    console.error("Erro ao atualizar informações do usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar informações do usuário" });
  }
});

app.put("/api/CarInfo/:id", async (req, res) => {
  const { id } = req.params;
  const { modelo, placa } = req.body;

  try {
    const Carro = await CarInfo.findOne({
      where: {
        id_motorista: id,
      },
    });
    if (!Carro) {
      return res.status(404).json({ error: "Carro não encontrado!" });
    }

    Carro.modelo = modelo || Carro.modelo;
    Carro.placa = placa || Carro.placa;

    await Carro.save();
    res
      .status(200)
      .json({ message: "Informações atualizadas com sucesso!", Carro });
  } catch (error) {
    console.error("Erro ao buscar dados do carro:", error);
    res.status(500).json({ error: "Erro ao buscar dados do carro" });
  }
});

app.post("/api/avaliacoes", async (req, res) => {
  const { id_avaliador, id_carona, nota, texto_avaliativo, role } = req.body;

  try {
    let id_avaliado;

    if (role === 0) {
      const carona = await Carona.findOne({ where: { id: id_carona } });
      if (!carona) {
        return res.status(404).json({ message: "Carona não encontrada." });
      }
      id_avaliado = carona.id_motorista;
    } else if (role === 1) {
      id_avaliado = req.body.id_avaliado;
    }
    const avaliacaoExistente = await Avaliacoes.findOne({
      where: { id_avaliador, id_avaliado, id_carona },
    });

    if (avaliacaoExistente) {
      return res
        .status(400)
        .json({ message: "Usuário já avaliado nesta carona!." });
    }
    const novaAvaliacao = await Avaliacoes.create({
      id_avaliador,
      id_avaliado,
      id_carona,
      nota,
      texto_avaliativo,
    });

    res.status(201).json(novaAvaliacao);
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    res.status(500).json({ message: "Erro interno ao salvar avaliação." });
  }
});

// Rota para atualizar o status da carona
app.put("/api/caronas/:id/status", async (req, res) => {
  const { id } = req.params; // ID da carona
  const { status } = req.body; // Novo status enviado no corpo da requisição

  try {
    // Validação do status
    if (![0, 1, 2, 3].includes(status)) {
      return res.status(400).json({ error: "Status inválido!" });
    }

    const carona = await Carona.findByPk(id);
    if (!carona) {
      return res.status(404).json({ error: "Carona não encontrada!" });
    }

    // Atualizar o status da carona
    carona.status = status;
    await carona.save();

    // Emitir atualização de status para os usuários conectados
    io.to(id).emit("atualizacaoStatus", { caronaId: id, status });

    res.json({ message: "Status da carona atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar o status da carona:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
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
