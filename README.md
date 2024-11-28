# Unirides🚗🎓

## 🤔Sobre o Projeto

**Unirides** é uma aplicação desenvolvida para facilitar a interação entre motoristas e passageiros para o compartilhamento de caronas, com foco em comunidades universitárias e corporativas. O objetivo principal é proporcionar um meio eficiente e seguro de transporte, promovendo a economia de recursos e a sustentabilidade.

## Funcionalidades Principais
- 🚗 Registro e autenticação de usuários como passageiros ou motoristas.
- 📝 Criação de caronas por motoristas, especificando local de partida, destino, horário, entre outros detalhes.
- 🔍 Busca e solicitação de caronas pelos passageiros.
- 📣 Notificações em tempo real via socket.io para eventos como motorista a caminho, motorista chegou e remoção de passageiros da carona.
- 💬 Sistema de chat em tempo real entre motoristas e passageiros.
- 📋 Visualização de detalhes de caronas e gerenciamento de participantes.

## Tecnologias Utilizadas

- **🐳 Docker**: Usado para containerizar e facilitar a execução do projeto, garantindo consistência no ambiente de desenvolvimento.
- **🟩 Node.js**: Plataforma usada para o backend da aplicação, responsável por gerenciar rotas, lógica de negócio e comunicação com o banco de dados.
- **⚛️ React**: Framework usado para construir o frontend da aplicação, garantindo uma interface dinâmica e interativa para o usuário.
- **🛠️ phpMyAdmin**: Utilizado para gerenciar o banco de dados MySQL de forma visual e prática durante o desenvolvimento.
- **💾 MySQL**: Banco de dados relacional usado para armazenar informações de usuários, caronas, mensagens e outros dados da aplicação.

## Requisitos para Rodar o Projeto
- **🐋🐧 Docker** (Linux)
- **🐋🪟 Docker Desktop** (Windows)

Certifique-se de ter o Docker instalado na máquina antes de iniciar.

## 🚀Como Iniciar o Projeto

1️⃣ **Clone o repositório do GitHub:**
   ```bash
   git clone https://github.com/danirso/Unirides.git
   ```

2️⃣ **Acesse o diretório do projeto:**
   ```bash
   cd Unirides
   ```

3️⃣ **Inicie o projeto usando o Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4️⃣ **Aguarde o Docker configurar os contêineres.** Quando a mensagem indicando que os serviços estão rodando aparecer, você poderá acessar a aplicação no navegador:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - phpMyAdmin: [http://localhost:8080](http://localhost:8080)

5️⃣ **Faça login ou crie uma conta para começar a usar o sistema.**

## 😵‍💫 Troubleshooting

### Problemas Comuns e Soluções

1️⃣ **Erro com Nodemailer em Redes Restritas**
   - Em redes corporativas ou escolares, o serviço de envio de e-mails pode ser bloqueado.
   - **Solução**: Tente utilizar outra rede, como a internet do celular por meio de um hotspot.

2️⃣ **Erro na Dependência do Nodemailer**
   - Caso o Nodemailer apresente erros relacionados à dependência, siga estes passos:
     ```bash
     cd Unirides/backend
     npm uninstall nodemailer
     npm install nodemailer --save
     ```
     Em seguida, reinicie o projeto usando `docker-compose up --build`.

3️⃣ **Conexão com o Banco de Dados**
   - Caso o backend não consiga se conectar ao banco de dados, verifique se o contêiner do MySQL está em execução e configurado corretamente no arquivo `docker-compose.yml`.

4️⃣ **Portas em Uso**
   - Se as portas necessárias já estiverem em uso, ajuste as configurações de portas no arquivo `docker-compose.yml` para valores disponíveis na sua máquina.

## Repositório

[Unirides - GitHub](https://github.com/danirso/Unirides)

Sinta-se à vontade para abrir issues ou enviar pull requests para colaborar com o projeto!

## 👨‍💻 Desenvolvedores

- [Leo](https://github.com/LevvonDev)
- [Daniel](https://github.com/danirso)
- [Berti](https://github.com/Bertidev)
- [Matheus](https://github.com/mttue7)
- [Magaldi](https://github.com/Magaldi2)