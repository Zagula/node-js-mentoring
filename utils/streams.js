'use strict';

import parseArgs from 'minimist';
import through2 from 'through2';
import split from 'split';
import request from 'request';
import fs from 'fs';
import utils from '../modules/utils';
import path from 'path';
import colors from '../modules/colors'

const argsArray = process.argv.slice(2);
const args = parseArgs(argsArray, {
    alias: {
        'help': 'h',
        'action': 'a',
        'file': 'f',
        'path': 'p'
    },
    string: ['action', 'file', 'path']
});

if (!argsArray.length && !module.parent) {
    console.log(`No arguments specified`.colorIt(colors.fg.red));
    usageMessage();
}
if (argsArray[0] && !argsArray[0].match(/^-(-help$|[a-z]*h)/i)) {
    args.help = false;
}

run(args);

export default function run(options) {
    if (!options) {
        console.log(`Specify option ACTION or HELP`);
        usageMessage();
        return
    }
    if (options.help) {
        usageMessage();
        listOfArguments();
        return;
    }
    switch (options.action) {
        case 'io':
            if (options.file) {
                pipeToStdout(options.file);
            } else {
                needArgument('file');
            }
            break;
        case 'transform':
            convertData();
            break;
        case 'transform-file':
            if (options.file) {
                CSVToJSON(options.file, false);
            } else {
                needArgument('file');
            }
            break;
        case 'transform-in-file':
            if (options.file) {
                CSVToJSON(options.file, true);
            } else {
                needArgument('file');
            }
            break;
        case 'css-bundle':
            if (options.path) {
                cssBuilder(options.path, options.shuffle)
            } else {
                needArgument('path');
            }
            break;
        default:
            if (options.action != void 0) {
                needArgument('action');
            }
    }
}

function pipeToStdout(file) {
    const reader = fs.createReadStream(file);
    reader.pipe(process.stdout);
}
function convertData() {
    process.stdin
        .pipe(through2(function (chunk, enc, callback) {
            callback(null, chunk.toString().toUpperCase());
        }))
        .pipe(process.stdout);
}
function CSVToJSON(file, toFile) {
    console.log(file,toFile)
    const reader = fs.createReadStream(file);
    reader.setEncoding('utf8');
    const writer = toFile ? fs.createWriteStream(`./data/${path.parse(file).name + '.json'}`) : process.stdout;
    let headers,
        line,
        isNotFirst = false;

    reader
        .pipe(split())
        .pipe(through2(function (chunk, enc, callback) {
            if (!headers) {
                headers = utils.split(chunk.toString());
                this.push('[');
                callback();
                return;
            }
            if (chunk = chunk.toString()) {
                let object = {};
                line = utils.split(chunk);
                for (let i = 0; i < headers.length; i++) {
                    object[headers[i]] = utils.trim(line[i]);
                }
                if (isNotFirst) {
                    this.push(',');
                }
                this.push(JSON.stringify(object));
                isNotFirst = true;
            }
            callback();
        }, function() {
            this.push(']');
        }))
        .pipe(writer);
}
function cssBuilder(dir, shuffle) {
    const url = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';
    const destination = 'bundle.css';
    fs.readdir(dir, (err, data) => {
        let cssFiles = data.filter((item, index, arr) => {
            if (item.match(/.css$/) && item !== destination) return true;
        });
        const writer = fs.createWriteStream(`${dir}/${destination}`);

        if (shuffle) {
            cssFiles.forEach((item) => {
                let stream = fs.createReadStream(`${dir}/${item}`);
                stream.pipe(split(/([^{]*{[^{}]*})/)).pipe(writer, {end: false});
            })
        } else {
            function pipeFile(index, isLast) {
                let stream = fs.createReadStream(`${dir}/${cssFiles[index]}`);
                stream.pipe(writer, {end: false});
                stream.on('end', () => {
                    if (!isLast) pipeFile(index + 1, !cssFiles[index + 2])
                    else {
                        request(url).pipe(writer);
                    }
                })
            }
            if (cssFiles.length) {
                pipeFile(0, !cssFiles[1]);
            }
        }
    })
}
function needArgument(argument) {
    console.log(`${'ERROR!'.colorIt(colors.fg.red)} Need Correct Argument: ${argument.colorIt(colors.fg.magenta)}\n`)
    usageMessage();
}
function usageMessage() {
    console.log(`USAGE: <action>|help [<file|path>]\n`.colorIt(colors.fg.cyan));
}
function listOfArguments() {
    console.log(`    ${'--help -h'.colorIt(colors.fg.yellow)}       Show this help message
    ${'--action -a'.colorIt(colors.fg.yellow)}     Select type of operation (io, transform, transform-file, transform-in-file, css-bundle)
    ${'--file -f'.colorIt(colors.fg.yellow)}       Path to file
    ${'--path -p'.colorIt(colors.fg.yellow)}       Path to directory
    `);
}