'use strict';

const help = {
    split: (string) => {
        return string.match(/((["'])[^\2]*?\2)|([^'",]+)|(?=^,)|(?=,$)|(?=,,)/g);
    },
    trim: (string = '') => {
        return string.replace(/^(["'])([^\1]*)\1/, "$2");
    }
}

export default {
    csvtojson: function(text) {
        let lines = text.split('\n');
        console.log(lines[0]);
        let headers = help.split(lines[0]);
        let result = [];

        for (let i = 1; i < lines.length - 1; i++) {
            let line = help.split(lines[i]);
            let object = {};
            for (let j = 0; j < headers.length; j++) {
                object[headers[j]] = help.trim(line[j]);
            }
            result.push(object);
        }
        return result;
    }
}