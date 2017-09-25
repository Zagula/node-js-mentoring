'use strict';

import * as config from './config/configs';
import { User, Product } from './modules';

console.log(config.name);

const user = new User();
const product = new Product();