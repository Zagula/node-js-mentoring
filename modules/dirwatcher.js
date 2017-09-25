'use strict';

import fs from 'fs';
import EventEmitter from 'events';

export default class DirWatcher extends EventEmitter {
    watch(path, delay) {
        let change = false;
        fs.watch(path, (eventType, filename) => {
            change = true;
        });
        setInterval(() => {
            if (change) {
                change = false;
                this.emit("dirwatcher:changed", null, path);
            }
        }, delay);
    }
}