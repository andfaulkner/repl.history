# repl.history

Persist a node repl's history to a file (now working with node v16+).

## from node

install: `npm install repl.history`

```javascript
const os = require('os');
const path = require('path');

const historyFile = path.join(os.homedir(), '.node_history');

const repl = require('repl').start('> ');
require('repl.history')(repl, historyFile);
```

this will drop a `.node_history` file in your home directory.

## from the command line

install: `npm install -g @andfaulkner/repl.history`

run `repl.history` on the command line

A file `~/.node_history` will be created.

I like to alias it to `nr` for node repl. To do this, add the following to your `~/.bashrc` file:

```
alias nr="repl.history"
```
