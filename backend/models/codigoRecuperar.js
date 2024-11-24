'use strict';
module.exports = (sequelize, DataTypes) => {
  const CodigosRecuperacao = sequelize.define('CodigosRecuperacao', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expiracao: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});

  CodigosRecuperacao.associate = function(models) {
    // Um código de recuperação pertence a um usuário
    CodigosRecuperacao.belongsTo(models.Usuario, {
      foreignKey: 'email', // O campo que será usado como chave estrangeira
      targetKey: 'email',   // O campo no modelo Usuario que será associado (neste caso, o email)
      onDelete: 'CASCADE'   // Se o usuário for excluído, os códigos de recuperação também serão
    });
  };
  

  return CodigosRecuperacao;
};
