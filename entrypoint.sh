#!/bin/bash
FLAG_FILE="/app/.installed"

if [ ! -f "$FLAG_FILE" ]; then
  echo "Executando instalação inicial..."

  cd /app/backend
  npm install

 
  cd /app/frontend
  npm install
  npm run build
  cd /app/backend

  touch "$FLAG_FILE"

  echo "Instalação inicial concluída."
else
  echo "Instalação já foi realizada anteriormente. Pulando o processo de instalação."
fi
  cd /app/backend
  
exec "$@"
