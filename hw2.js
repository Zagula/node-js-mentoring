'use strict';

import Importer from './modules/importer';
import DirWatcher from './modules/dirwatcher';

const dirWatcher = new DirWatcher();
const importer = new Importer(dirWatcher);

importer.import("./data").then((data) => {
    console.log("----START DATA----");
    console.log(data);
    console.log("-----END DATA-----");
}, (err) => {
    console.log(err)
});

console.log(importer.importSync("./data"));