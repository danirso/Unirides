// controllers/caronaController.js
const { Carona } = require('../models');

exports.atualizarEstadoMotorista = async (req, res) => {
  const { id_carona, status_motorista } = req.body;

  if (![0, 1, 2, 3].includes(status_motorista)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  try {
    const carona = await Carona.findByPk(id_carona);
    if (!carona) {
      return res.status(404).json({ error: "Carona não encontrada" });
    }

    carona.status_motorista = status_motorista;
    await carona.save();

    return res.json({ message: "Estado atualizado com sucesso", carona });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar estado" });
  }
};
