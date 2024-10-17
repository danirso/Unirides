// models/passageirosCaronas.js
module.exports = (sequelize, DataTypes) => {
    const PassageirosCaronas = sequelize.define('PassageirosCaronas', {
      id_passageiro: {
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
      }
    }, {
      tableName: 'PassageirosCaronas',
      timestamps: true
    });
  
    return PassageirosCaronas;
  };
  