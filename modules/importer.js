'use strict';

import fs from 'fs';
import * as config from '../config/configs';
import utils from './utils';

export default class Importer {
    constructor(dirWatcher) {
        this.dirWatcher = dirWatcher;
    }
    import(path) {
        this.dirWatcher.watch(path, config.dirWatcher.delay);
        return new Promise((resolve, reject) => {
            this.dirWatcher.on("dirwatcher:changed", (err, path) => {
                if (err) reject(err);

                fs.readdir(path, (err, files) => {
                    let totalFiles = 0,
                        totalData = [];
                    for (let i = 0; i < files.length; i++) {
                        fs.readFile(`${path}\\${files[i]}`, (err, data) => {
                            if (err) reject(err);
                            totalData = totalData.concat(utils.csvtojson(data.toString()));
                            totalFiles++;
                            if (totalFiles == files.length) resolve(totalData);
                        });
                    }
                });
            });
        });
    }
    importSync(path) {
        let files = fs.readdirSync(path);
        let totalData = [];
        for (let i = 0; i < files.length; i++) {
            totalData = totalData.concat(utils.csvtojson(fs.readFileSync(`${path}\\${files[i]}`, {encoding: "utf-8"})));
            console.log(totalData)
        }
        return totalData;
    }
}