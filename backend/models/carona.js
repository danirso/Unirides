// models/carona.js
module.exports = (sequelize, DataTypes) => {
  const Carona = sequelize.define('Carona', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_motorista: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    partida: {
      type: DataTypes.STRING
    },
    destino: {
      type: DataTypes.STRING
    },
    horario: {
      type: DataTypes.DATE
    },
    vagas: {
      type: DataTypes.INTEGER
    },
    vagas_disponiveis: {
      type: DataTypes.INTEGER
    },
    ar: {
      type: DataTypes.TINYINT
    },
    musica: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Caronas',
    timestamps: true
  });

  Carona.associate = (models) => {
    // Relacionamento com a tabela Usuario para o motorista
    Carona.belongsTo(models.Usuario, { as: 'motorista', foreignKey: 'id_motorista' });
    
    // Relacionamento com a tabela intermediária PassageirosCaronas
    Carona.belongsToMany(models.Usuario, {
      through: 'PassageirosCaronas',
      as: 'passageiros',
      foreignKey: 'id_carona'
    });
  };

  return Carona;
};
