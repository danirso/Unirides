const express = require('express');
const app = express();
const port = 3000;

// Definir uma rota básica
app.get('/', (req, res) => {
  res.send('Bem-vindo ao sistema de caronas!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
