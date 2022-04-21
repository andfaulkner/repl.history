const fs = require('fs');

module.exports = (repl, file) => {
    try {
        const stat = fs.statSync(file);
        repl.history = fs.readFileSync(file, 'utf-8').split('\n').reverse();
        repl.history.shift();
        repl.historyIndex = -1; // will be incremented before pop
    } catch (e) {}

    const fd = fs.openSync(file, 'a');
    const reval = repl.eval;

    const wstream = fs.createWriteStream(file, {fd: fd});
    wstream.on('error', err => {
        throw err;
    });

    repl.addListener('line', code => {
        if (code && code !== '.history') {
            wstream.write(code + '\n');
        } else {
            repl.historyIndex++;
            repl.history.pop();
        }
    });

    process.on('exit', () => fs.closeSync(fd));

    repl.commands['history'] = {
        help: 'Show the history',
        action: function () {
            let out = [];
            repl.history.forEach((v, k) => out.push(v));
            repl.outputStream.write(out.reverse().join('\n') + '\n');
            repl.displayPrompt();
        }
    };
};
