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
      type: DataTypes.STRING,
      allowNull: false // Garantindo que o celular seja obrigatório
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Adicionando unique para evitar emails duplicados
    },
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0 // 0 = passageiro, 1 = motorista
    }
  }, {
    tableName: 'Usuarios',
    timestamps: true
  });

  Usuario.associate = (models) => {
    
    Usuario.belongsToMany(models.Carona, {
      through: models.PassageirosCaronas,
      foreignKey: 'id_passageiro', // Chave estrangeira que refere a tabela Usuario
      otherKey: 'id_carona',       // Chave estrangeira que refere a tabela Carona
      as: 'caronas'                // Nome da associação
    });
    
    Usuario.hasMany(models.Avaliacoes, {
      foreignKey: 'id_avaliado',
      as: 'avaliacoes'
    });

    Usuario.hasOne(models.CarInfo,{
      foreignKey:'id_motorista',
      as:'veiculo'
    });
    
  };
  return Usuario;
};
