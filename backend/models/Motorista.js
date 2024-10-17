// models/motorista.js
module.exports = (sequelize, DataTypes) => {
    const Motorista = sequelize.define('Motorista', {
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
      tableName: 'Motoristas',
      timestamps: true
    });
  
    return Motorista;
};
