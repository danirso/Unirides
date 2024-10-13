# Use uma imagem oficial do Node.js como base
FROM node:latest

# Diretório de trabalho para o backend
WORKDIR /app/backend

# Copie e instale as dependências do backend
COPY backend/package*.json ./
RUN npm install

# Copie o código do backend
COPY backend/ .

# Build do frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Volte para o backend e sirva os arquivos estáticos do frontend
WORKDIR /app/backend
RUN mkdir -p public && cp -r /app/frontend/build/* public/

# Exponha a porta do Node.js
EXPOSE 3000

# Iniciar o backend
CMD ["npm", "start"]
