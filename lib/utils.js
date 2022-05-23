global.utils = {};

const fs      = require('fs');
const pathlib = require('path');
const Logger  = require('./utils/_core/log/logger.js');

var log    = new Logger('UTILS', 'DEBUG', 'logs/system.log');

function delve(directory, file) {
    var path = pathlib.join(directory, file);
    let mod = pathlib.basename(pathlib.dirname(path));
    var stats = fs.statSync(path);
    if (stats.isDirectory()) {
        let files = fs.readdirSync(path);
        for (let i = 0; i < files.length; i++) {
            delve(path, files[i]);
        }
    }else{
        let f  = pathlib.basename(path);
        let id = f.substring(0, f.length - 3);
        if (!(utils?.[mod])) utils[mod] = {};
        utils[mod][id] = require(path);
        log.info(`Loaded {{white}}${f}{{cyan}} as {{blue}}utils.${mod}.${id}{{cyan}}.`);
        return;
    }
}

delve(__dirname + '/utils', '');