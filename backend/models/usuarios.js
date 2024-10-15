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

  return Usuario;
};
