// models/PassageirosCaronas.js
module.exports = (sequelize, DataTypes) => {
  const PassageirosCaronas = sequelize.define('PassageirosCaronas', {
    id_passageiro: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios', // Nome da tabela
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_carona: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Caronas',  // Nome da tabela
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'PassageirosCaronas',
    timestamps: true
  });

  // Adicionando a associação com o modelo Usuario
  PassageirosCaronas.associate = (models) => {
    PassageirosCaronas.belongsTo(models.Usuario, {
      foreignKey: 'id_passageiro',
      as: 'passageiro',  // O alias para a associação
    });
    PassageirosCaronas.belongsTo(models.Carona, {
      foreignKey: 'id_carona',
      as: 'carona', // O alias para a associação
    });
  };

  return PassageirosCaronas;
};
