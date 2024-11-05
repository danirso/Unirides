'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Adicionar motoristas
    await queryInterface.bulkInsert('Usuarios', [
      { nome: 'Hugo', ra: 22000290, celular: '18997844864', email: 'hugo@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Denis', ra: 22000787, celular: '19971228940', email: 'denis@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Berti', ra: 22007440, celular: '17996530929', email: 'berti@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Konda', ra: 22008026, celular: '19999098585', email: 'konda@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Magaldi', ra: 22004139, celular: '19981231003', email: 'magaldi@motorista.com', role: 1, senha: 'password', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Recuperar IDs dos motoristas
    const motoristas = await queryInterface.sequelize.query(
      `SELECT id FROM Usuarios WHERE role = 1;`
    );

    // Mapear IDs
    const motoristaIds = motoristas[0].map(motorista => motorista.id);

    // Adicionar informações dos carros para motoristas
    await queryInterface.bulkInsert('CarInfo', [
      { id_motorista: motoristaIds[0], modelo: 'Honda Civic', placa: 'ABC1234', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[1], modelo: 'Toyota Corolla', placa: 'XYZ5678', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[2], modelo: 'Chevrolet Onix', placa: 'AAA1A23', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[3], modelo: 'Ford Ka', placa: 'BBB2345', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[4], modelo: 'Volkswagen Polo', placa: 'CCC3C56', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Adicionar passageiros
    await queryInterface.bulkInsert('Usuarios', [
      { nome: 'Xande', ra: 22002341, celular: '19971413871', email: 'xande@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Guto', ra: 22008248, celular: '16994557100', email: 'guto@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Leo', ra: 22017958, celular: '19999776399', email: 'leo@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Galassi', ra: 22005768, celular: '19999135763', email: 'galassi@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Matue', ra: 22011982, celular: '19971063947', email: 'matue@passageiro.com', role: 0, senha: 'password', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Recuperar IDs dos passageiros
    const passageiros = await queryInterface.sequelize.query(
      `SELECT id FROM Usuarios WHERE role = 0;`
    );

    const passageiroIds = passageiros[0].map(passageiro => passageiro.id);

    // Adicionar caronas futuras
    await queryInterface.bulkInsert('Caronas', [
      { id_motorista: motoristaIds[0], partida: 'Paulínia', destino: 'Tupi Paulista', horario: new Date("2024-11-05T18:00:00"), vagas: 4, vagas_disponiveis: 2, ar: 1, musica: 'Rock', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[1], partida: 'Barão Geraldo', destino: 'Centro', horario: new Date("2024-11-06T12:30:00"), vagas: 3, vagas_disponiveis: 1, ar: 0, musica: 'Sertanejo', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[2], partida: 'Shopping', destino: 'CT-A', horario: new Date("2024-11-11T16:15:00"), vagas: 4, vagas_disponiveis: 3, ar: 1, musica: 'Jazz', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Adicionar caronas passadas para o histórico
    await queryInterface.bulkInsert('Caronas', [
      { id_motorista: motoristaIds[0], partida: 'Campinas', destino: 'Paulínia', horario: new Date("2024-09-10T11:00:00"), vagas: 4, vagas_disponiveis: 0, ar: 1, musica: 'Rock', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[1], partida: 'São Paulo', destino: 'Barão Geraldo', horario: new Date("2024-09-15T20:00:00"), vagas: 3, vagas_disponiveis: 0, ar: 0, musica: 'Sertanejo', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[2], partida: 'Jundiaí', destino: 'Campinas', horario: new Date("2024-09-20T15:00:00"), vagas: 4, vagas_disponiveis: 1, ar: 1, musica: 'Pop', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[3], partida: 'Nova Odessa', destino: 'Americana', horario: new Date("2024-09-23T10:30:00"), vagas: 2, vagas_disponiveis: 0, ar: 1, musica: 'Clássica', createdAt: new Date(), updatedAt: new Date() },
      { id_motorista: motoristaIds[4], partida: 'Paulínia', destino: 'Nova Granada', horario: new Date("2024-09-28T13:00:00"), vagas: 4, vagas_disponiveis: 2, ar: 0, musica: 'Hip Hop', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Recuperar IDs das caronas
    const caronas = await queryInterface.sequelize.query(
      `SELECT id FROM Caronas;`
    );

    const caronaIds = caronas[0].map(carona => carona.id);

    // Adicionar passageiros nas caronas futuras
    await queryInterface.bulkInsert('PassageirosCaronas', [
      { id_passageiro: passageiroIds[0], id_carona: caronaIds[0], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[1], id_carona: caronaIds[0], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[2], id_carona: caronaIds[1], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[3], id_carona: caronaIds[2], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[4], id_carona: caronaIds[3], createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Adicionar passageiros nas caronas passadas (histórico)
    await queryInterface.bulkInsert('PassageirosCaronas', [
      { id_passageiro: passageiroIds[0], id_carona: caronaIds[4], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[1], id_carona: caronaIds[5], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[2], id_carona: caronaIds[6], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[3], id_carona: caronaIds[7], createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: passageiroIds[4], id_carona: caronaIds[8], createdAt: new Date(), updatedAt: new Date() }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PassageirosCaronas', null, {});
    await queryInterface.bulkDelete('Caronas', null, {});
    await queryInterface.bulkDelete('CarInfo', null, {});
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
