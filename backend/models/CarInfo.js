// models/carInfo.js
module.exports = (sequelize, DataTypes) => {
    const CarInfo = sequelize.define('CarInfo', {
      id_motorista: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Usuario',
          key: 'id'
        },
        primaryKey: true
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      placa: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'CarInfo',
      timestamps: true
    });
  
    CarInfo.associate = (models) => {
      // Relacionamento com a tabela Usuario (motorista)
      CarInfo.belongsTo(models.Usuario, { as: 'motorista', foreignKey: 'id_motorista' });
    };
  
    return CarInfo;
  };
  