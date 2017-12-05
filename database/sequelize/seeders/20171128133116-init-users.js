'use strict';

const data = require('../../../models/users');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let currentDate = new Date(),
      insertData = data.map(user => {
        return {
          name: user.name,
          age: user.age,
          createdAt: currentDate,
          updatedAt: currentDate
        }
      });
    return queryInterface.bulkInsert('Users', insertData);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', {});
  }
};
