'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela Usuarios
    await queryInterface.createTable('Usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ra: {
        type: Sequelize.INTEGER, // RA agora é INTEGER
        allowNull: false
      },
      celular: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      senha: {
        type: Sequelize.STRING, // Campo para armazenar a senha criptografada
        allowNull: false
      },
      role: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
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
      id_passageiro: {
        type: Sequelize.INTEGER, // id_passageiro como INTEGER
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_motorista: {
        type: Sequelize.INTEGER, // id_motorista como INTEGER
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      destino: {
        type: Sequelize.STRING
      },
      horario: {
        type: Sequelize.DATE
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
  },

  down: async (queryInterface, Sequelize) => {
    // Deletar as tabelas
    await queryInterface.dropTable('Caronas');
    await queryInterface.dropTable('Usuarios');
  }
};
