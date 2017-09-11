'use strict';

const config = require("./config/configs.json");
const modules = require("./modules");

console.log(config.name);

new modules.User();
new modules.Product();