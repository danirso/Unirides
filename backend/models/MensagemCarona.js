// models/MensagemCarona.js
module.exports = (sequelize, DataTypes) => {
    const MensagemCarona = sequelize.define("MensagemCarona", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      caronaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Caronas", // Nome da tabela de caronas, se tiver
          key: "id",
        },
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios", // Nome da tabela de usuários
          key: "id",
        },
      },
      mensagem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },{
      tableName: 'MensagemCaronas',
      timestamps:true
    });
  
    MensagemCarona.associate = (models) => {

      MensagemCarona.belongsTo(models.Usuario, {  as: 'autor',foreignKey: 'usuarioId' });}

    return MensagemCarona;
  };

