'use strict';

//const ProductOptions = require('./productoptions');

module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      defaultValue: 'Noname'
    },
    brand: {
      type: DataTypes.STRING,
      defaultValue: 'Noname'
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });
  return Product;
};