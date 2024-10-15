'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar passageiros
    const passageiros = await queryInterface.bulkInsert('Passageiros', [
      { nome: 'Passageiro 1', ra: 'RA001', celular: '123456789', email: 'pass1@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Passageiro 2', ra: 'RA002', celular: '123456780', email: 'pass2@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Passageiro 3', ra: 'RA003', celular: '123456781', email: 'pass3@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Passageiro 4', ra: 'RA004', celular: '123456782', email: 'pass4@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Passageiro 5', ra: 'RA005', celular: '123456783', email: 'pass5@example.com', createdAt: new Date(), updatedAt: new Date() }
    ], { returning: true });

    console.log('Passageiros:', passageiros); // Verifica os passageiros inseridos

    // Criar motoristas
    const motoristas = await queryInterface.bulkInsert('Motoristas', [
      { nome: 'Motorista 1', ra: 'RA101', celular: '123456784', email: 'motorista1@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Motorista 2', ra: 'RA102', celular: '123456785', email: 'motorista2@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Motorista 3', ra: 'RA103', celular: '123456786', email: 'motorista3@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Motorista 4', ra: 'RA104', celular: '123456787', email: 'motorista4@example.com', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Motorista 5', ra: 'RA105', celular: '123456788', email: 'motorista5@example.com', createdAt: new Date(), updatedAt: new Date() }
    ], { returning: true });

    console.log('Motoristas:', motoristas); // Verifica os motoristas inseridos

    // Criar caronas
    await queryInterface.bulkInsert('Caronas', [
      { id_passageiro: 1, id_motorista: 1, destino: 'Destino A', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: 2, id_motorista: 2, destino: 'Destino B', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: 3, id_motorista: 3, destino: 'Destino C', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: 4, id_motorista: 4, destino: 'Destino D', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id_passageiro: 5, id_motorista: 5, destino: 'Destino E', horario: new Date(), createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Caronas', null, {});
    await queryInterface.bulkDelete('Motoristas', null, {});
    await queryInterface.bulkDelete('Passageiros', null, {});
  }
};
