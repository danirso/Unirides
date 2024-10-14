'use strict';
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ra: {
      type: DataTypes.STRING,
      allowNull: false
    },
    celular: DataTypes.STRING,
    email: DataTypes.STRING,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {});

  Usuario.associate = function(models) {
    // Defina as associações aqui se precisar
  };
  return Usuario;
};
