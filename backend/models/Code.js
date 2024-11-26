module.exports = (sequelize, DataTypes) => {
    const Code = sequelize.define('Code', {
      // Remover o campo 'email' e usar 'id_usuario'
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios', // Referência à tabela de Usuarios
          key: 'id'
        }
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garantir que o código seja único
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfter: new Date().toString(), // Garantir que a data de expiração é futura
        },
      },
    }, {
      tableName: 'Codes'  // Garante que a tabela seja chamada 'Codes'
    });
  
    Code.associate = (models) => {
      Code.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario', // Corrigir a referência da chave estrangeira
        onDelete: 'CASCADE',
      });
    };
  
    return Code;
};
