const fs = require('fs');

date_format = () => {return new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '')};

const label_spacing = 7;
const level_spacing = 6;
const term_reset = '\u001b[39m';
const term_codes = {
    fg_black:   '\u001b[38;5;16m',
    fg_red:     '\u001b[38;5;196m',
    fg_green:   '\u001b[38;5;46m',
    fg_yellow:  '\u001b[38;5;208m',
    fg_blue:    '\u001b[38;5;39m',
    fg_magenta: '\u001b[38;5;165m',
    fg_cyan:    '\u001b[38;5;51m',
    fg_white:   '\u001b[38;5;15m',
    blink_on:   '\u001b[5m',
    blink_off:  '\u001b[25m',
};
const levels = {
    DEBUG:  {value: 5, colour: term_codes.fg_blue, blink: false},
    INFO:   {value: 4, colour: term_codes.fg_cyan, blink: false},
    WARN:   {value: 3, colour: term_codes.fg_yellow, blink: true},
    ERROR:  {value: 2, colour: term_codes.fg_red, blink: true},
    NOTICE: {value: 1, colour: term_codes.fg_white, blink: true},
};
const codes = [
    {str: '{{black}}',     lookup: term_codes.fg_black},
    {str: '{{red}}',       lookup: term_codes.fg_red},
    {str: '{{green}}',     lookup: term_codes.fg_green},
    {str: '{{blue}}',      lookup: term_codes.fg_blue},
    {str: '{{magenta}}',   lookup: term_codes.fg_magenta},
    {str: '{{cyan}}',      lookup: term_codes.fg_cyan},
    {str: '{{white}}',     lookup: term_codes.fg_white},
    {str: '{{blink_on}}',  lookup: term_codes.blink_on},
    {str: '{{blink_off}}', lookup: term_codes.blink_off},
];

let Logger = class {
    constructor(label, log_level, filepath) {
        this.label = label;
        this.level = levels[log_level].value;
        this.path  = filepath;
    }
    async log(level, message) {
        var blink_on  = levels[level].blink ? '{{blink_on}}'  : '';
        var blink_off = levels[level].blink ? '{{blink_off}}' : '';
        var msg = `{{white}}${date_format()} : `; //Date stamp
        msg    += `{{green}}${this.label.padEnd(label_spacing, ' ')}{{white}} : `; //label
        msg    += `${levels[level].colour}${blink_on}${level.padEnd(level_spacing, ' ')}${blink_off}{{white}} : `; //Log Level
        msg    += `${levels[level].colour}${message}${term_reset}`; //Message
        for (let c = 0; c < codes.length; c++) {
            const chk = codes[c];
            msg = msg.replaceAll(chk.str, chk.lookup);
        }
        console.log(msg);
        fs.appendFile(this.path, msg + '\n', (err) => {
            if (err) throw err;
        });
    }

    debug(message) {
        if (this.level < levels.DEBUG.value) return;
        this.log('DEBUG', message);
    }

    info(message) {
        if (this.level < levels.INFO.value) return;
        this.log('INFO', message);
    }

    warn(message) {
        if (this.level < levels.WARN.value) return;
        this.log('WARN', message);
    }

    error(message) {
        if (this.level < levels.ERROR.value) return;
        this.log('ERROR', message);
    }

    notice(message) {
        this.log('NOTICE', message);
    }
};

module.exports = Logger;