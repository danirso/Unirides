'use strict';
module.exports = (sequelize, DataTypes) => {
  const Carona = sequelize.define('Carona', {
    destino: DataTypes.STRING,
    horario: DataTypes.DATE
  }, {});

  Carona.associate = function(models) {
    Carona.belongsTo(models.Usuario, { as: 'passageiro', foreignKey: 'id_passageiro' });
    Carona.belongsTo(models.Usuario, { as: 'motorista', foreignKey: 'id_motorista' });
  };

  return Carona;
};
