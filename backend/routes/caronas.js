const express = require('express');
const router = express.Router();
const { Carona, Usuario } = require('../models');

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

module.exports = router;
