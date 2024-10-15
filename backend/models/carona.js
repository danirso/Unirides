// models/carona.js
module.exports = (sequelize, DataTypes) => {
  const Carona = sequelize.define('Carona', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_passageiro: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    id_motorista: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    destino: {
      type: DataTypes.STRING
    },
    horario: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'Caronas',
    timestamps: true
  });

  Carona.associate = (models) => {
    Carona.belongsTo(models.Usuario, { as: 'Passageiro', foreignKey: 'id_passageiro' });
    Carona.belongsTo(models.Usuario, { as: 'Motorista', foreignKey: 'id_motorista' });
  };

  return Carona;
};
