// models/passageiro.js
module.exports = (sequelize, DataTypes) => {
  const Passageiro = sequelize.define('Passageiro', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ra: {
      type: DataTypes.STRING,
      allowNull: false
    },
    celular: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Passageiros',
    timestamps: true
  });

  return Passageiro;
};
