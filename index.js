const fs = require('fs');

module.exports = (repl, file) => {

    // Ensures package works with node.js v16+, (where repl.rli has been removed)
    const replRoot = repl && repl.rli ? repl.rli : repl;

    try {
        const stat = fs.statSync(file);
        replRoot.history = fs.readFileSync(file, 'utf-8').split('\n').reverse();
        replRoot.history.shift();
        replRoot.historyIndex = -1; // will be incremented before pop
    } catch (e) {}

    const fd = fs.openSync(file, 'a');
    const reval = repl.eval;

    const wstream = fs.createWriteStream(file, {fd: fd});
    wstream.on('error', err => {
        throw err;
    });

    replRoot.addListener('line', code => {
        if (code && code !== '.history') {
            wstream.write(code + '\n');
        } else {
            replRoot.historyIndex++;
            replRoot.history.pop();
        }
    });

    process.on('exit', () => fs.closeSync(fd));

    repl.commands['history'] = {
        help: 'Show the history',
        action: function () {
            let out = [];
            replRoot.history.forEach((v, k) => out.push(v));
            repl.outputStream.write(out.reverse().join('\n') + '\n');
            repl.displayPrompt();
        }
    };
};
