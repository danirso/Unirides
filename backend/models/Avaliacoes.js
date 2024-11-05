// models/Avaliacoes.js
module.exports = (sequelize, DataTypes) => {
    const Avaliacoes = sequelize.define('Avaliacoes', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        },  
      id_avaliador: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_avaliado: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_carona: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Caronas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nota: {
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      texto_avaliativo: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'Avaliacoes',
      timestamps: true
    });
  
    return Avaliacoes;
  };
