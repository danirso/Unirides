const express = require('express');
const router = express.Router();
const { Carona, Usuario } = require('../models');

// Endpoint para buscar todas as caronas, incluindo dados de passageiro e motorista
router.get('/caronas', async (req, res) => {
  try {
    const caronas = await Carona.findAll({
      include: [
        { model: Usuario, as: 'passageiro', attributes: ['nome'] },
        { model: Usuario, as: 'motorista', attributes: ['nome'] }
      ]
    });
    res.json(caronas);
  } catch (error) {
    console.error('Erro ao buscar caronas:', error);
    res.status(500).send('Erro ao buscar caronas');
  }
});

// Endpoint para solicitar uma carona (adiciona o passageiro à carona)
router.put('/caronas/:id/solicitar', async (req, res) => {
  try {
    const { id } = req.params; // ID da carona
    const { id_passageiro } = req.body; // ID do passageiro enviado pelo frontend

    // Encontrar a carona pelo ID
    const carona = await Carona.findByPk(id);
    if (!carona) {
      return res.status(404).json({ message: 'Carona não encontrada.' });
    }

    // Atualizar a carona com o ID do passageiro
    carona.id_passageiro = id_passageiro;
    await carona.save(); // Salva a atualização no banco de dados

    res.status(200).json({ message: 'Carona solicitada com sucesso!' });
  } catch (error) {
    console.error('Erro ao solicitar carona:', error);
    res.status(500).json({ message: 'Erro ao solicitar carona.' });
  }
});

module.exports = router;
