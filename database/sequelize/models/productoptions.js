'use strict';

module.exports = (sequelize, DataTypes) => {
  var ProductOptions = sequelize.define('ProductOptions', {
    color: {
      type: DataTypes.STRING,
      defaultValue: 'not specified'
    },
    size: {
      type: DataTypes.STRING,
      defaultValue: 'not specified'
    },
    productId: DataTypes.INTEGER
  });
  return ProductOptions;
};