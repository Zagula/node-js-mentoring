'use strict';

const config = require("./config/configs.json");
const models = require("./models");

console.log(config.name);

new models.User();
new models.Product();