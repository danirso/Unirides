'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   // Criar tabela Usuarios
await queryInterface.createTable('Usuarios', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ra: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  celular: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false, // Tornar obrigatório para evitar problemas futuros
    unique: true,     // Garante que o email seja único no sistema
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0, // 0: passageiro, 1: motorista
  },
  verificationCode: {
    type: Sequelize.STRING,
    allowNull: true, // Pode ser nulo, só será usado em caso de recuperação de senha
  },
  verificationCodeExpiry: {
    type: Sequelize.DATE,
    allowNull: true, // Pode ser nulo, só será usado em caso de recuperação de senha
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});


    // Criar tabela CarInfo
    await queryInterface.createTable('CarInfo', {
      id_motorista: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      placa: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Criar tabela Caronas
    await queryInterface.createTable('Caronas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_motorista: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      partida: {
        type: Sequelize.STRING
      },
      destino: {
        type: Sequelize.STRING
      },
      horario: {
        type: Sequelize.DATE
      },
      vagas: {
        type: Sequelize.INTEGER
      },
      vagas_disponiveis: {
        type: Sequelize.INTEGER
      },
      ar: {
        type: Sequelize.TINYINT
      },
      musica: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      status_motorista: {
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      }
    });

    // Criar tabela intermediária de Caronas e Passageiros
    await queryInterface.createTable('PassageirosCaronas', {
      id_passageiro: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_carona: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Caronas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Criar tabela Avaliacoes
    await queryInterface.createTable('Avaliacoes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_avaliador: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_avaliado: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_carona: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Caronas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nota: {
        type: Sequelize.INTEGER
      },
      texto_avaliativo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      media: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
    //cria a tabela de mensagens de chat
    await queryInterface.createTable("MensagemCaronas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      caronaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Caronas", // Nome da tabela de caronas
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios", // Nome da tabela de usuários
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      mensagem: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Criar tabela Code
    await queryInterface.createTable('Codes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_usuario: {  // Alteração: Referência ao 'id' do usuário
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios', // Referência à tabela de Usuários
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    

  },


  down: async (queryInterface, Sequelize) => {
    // Deletar as tabelas na ordem inversa de criação
    await queryInterface.dropTable('MensagemCaronas');
    await queryInterface.dropTable('Avaliacoes');
    await queryInterface.dropTable('Codes');
    await queryInterface.dropTable('PassageirosCaronas');
    await queryInterface.dropTable('Caronas');
    await queryInterface.dropTable('CarInfo');
    await queryInterface.dropTable('Usuarios');
  }
};
