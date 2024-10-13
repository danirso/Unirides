const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir os arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, 'public')));

// Rota coringa para servir o index.html do React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
