// models/Avaliacoes.js
module.exports = (sequelize, DataTypes) => {
  const Avaliacoes = sequelize.define('Avaliacoes', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_avaliador: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_avaliado: {
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
    },
    nota: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    texto_avaliativo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    media: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'Avaliacoes',
    timestamps: true
  });

  // Função para recalcular a média e salvar no campo "media"
  async function recalcularMedia(idAvaliado) {
    const avaliacoes = await Avaliacoes.findAll({ where: { id_avaliado: idAvaliado } });

    const totalNotas = avaliacoes.reduce((acc, cur) => acc + cur.nota, 0);
    const media = avaliacoes.length ? totalNotas / avaliacoes.length : 0;

    // Atualiza o campo "media" de todas as avaliações do mesmo avaliado
    await Avaliacoes.update(
      { media },
      { where: { id_avaliado: idAvaliado } }
    );
  }

  // Hooks para recalcular a média
  Avaliacoes.afterCreate(async (avaliacao, options) => {
    await recalcularMedia(avaliacao.id_avaliado);
  });

  Avaliacoes.afterUpdate(async (avaliacao, options) => {
    await recalcularMedia(avaliacao.id_avaliado);
  });

  Avaliacoes.afterDestroy(async (avaliacao, options) => {
    await recalcularMedia(avaliacao.id_avaliado);
  });

  return Avaliacoes;
};
