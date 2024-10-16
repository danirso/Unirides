'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Adicionar motoristas
    await queryInterface.bulkInsert('Usuarios', [
      { nome: 'Hugo', ra: 22000290, celular: '18997844864', email: 'hugo@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Denis', ra: 22000787, celular: '19971228940', email: 'denis@motoristacom', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Berti', ra: 22007440, celular: '17996530929', email: 'berti@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Konda', ra: 22008026, celular: '19999098585', email: 'konda@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Magaldi', ra: 22004139, celular: '19981231003', email: 'magaldi@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Adicionar passageiros
    await queryInterface.bulkInsert('Usuarios', [
      { nome: 'Xande', ra: 22002341, celular: '19971413871', email: 'xande@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Guto', ra: 22008248, celular: '16994557100', email: 'guto@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Leo', ra: 22017958, celular: '19999776399', email: 'leo@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Galassi', ra: 22005768, celular: '19999135763', email: 'galassi@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Matue', ra: 22011982, celular: '19971063947', email: 'matue@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Recuperar IDs dos motoristas e passageiros
    const motoristas = await queryInterface.sequelize.query(
      `SELECT id FROM Usuarios WHERE role = 1;`
    );
    const passageiros = await queryInterface.sequelize.query(
      `SELECT id FROM Usuarios WHERE role = 0;`
    );

    // Mapear IDs
    const motoristaIds = motoristas[0].map(motorista => motorista.id);
    const passageiroIds = passageiros[0].map(passageiro => passageiro.id);

    // Adicionar caronas
    await queryInterface.bulkInsert('Caronas', [
      { id_passageiro: passageiroIds[0], id_motorista: motoristaIds[0], destino: 'Tupi Paulista', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[1], id_motorista: motoristaIds[1], destino: 'Centro', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[2], id_motorista: motoristaIds[2], destino: 'Shopping', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[3], id_motorista: motoristaIds[3], destino: 'Nova Granada', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[4], id_motorista: motoristaIds[4], destino: 'Salto', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: null, id_motorista: motoristaIds[1], destino: 'H15', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: null, id_motorista: motoristaIds[3], destino: 'Cambui', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: null, id_motorista: motoristaIds[0], destino: 'Mansões Santo Antonio', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: null, id_motorista: motoristaIds[4], destino: 'Valinhos', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: null, id_motorista: motoristaIds[2], destino: 'Indaiatuba', horario: new Date(), createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove todos os registros inseridos
    await queryInterface.bulkDelete('Caronas', null, {});
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
