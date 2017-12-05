'use strict';

const data = require('../../../models/products');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let productsData = [],
      productOptionsData = [],
      currentDate = new Date();

    data.forEach(element => {
      productsData.push({
        name: element.name,
        brand: element.brand,
        price: element.price,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      productOptionsData.push({
        size: element.options.size,
        color: element.options.color,
        createdAt: currentDate,
        updatedAt: currentDate
      });
    });
    return queryInterface
      .bulkInsert('Products', productsData, { returning: true })
      .then(products => {
        products.forEach((product, index) => {
          productOptionsData[index].productId = product.id;
        });
        queryInterface.bulkInsert('ProductOptions', productOptionsData);
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', {}).then(() => {
      queryInterface.bulkDelete('ProductOptions', {});
    });
  }
};
