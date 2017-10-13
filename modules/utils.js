'use strict';

export default {
    csvtojson: function(text) {
        let lines = text.split('\n');
        console.log(lines[0]);
        let headers = this.split(lines[0]);
        let result = [];

        for (let i = 1; i < lines.length - 1; i++) {
            let line = this.split(lines[i]);
            let object = {};
            for (let j = 0; j < headers.length; j++) {
                object[headers[j]] = this.trim(line[j]);
            }
            result.push(object);
        }
        return result;
    },
    split: (string) => {
        return string.match(/((["'])[^\2]*?\2)|([^'",]+)|(?=^,)|(?=,$)|(?=,,)/g);
    },
    trim: (string = '') => {
        return string.replace(/^(["'])([^\1]*)\1/, "$2");
    }
}