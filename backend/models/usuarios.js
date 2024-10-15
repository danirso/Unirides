// models/usuario.js
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
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
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'Usuarios',
    timestamps: true
  });

  return Usuario;
};
