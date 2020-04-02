#!/usr/bin/env node

"use strict";
const express = require('express');
const ws = require('express-ws');
const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');

// read the args
let port = 8088;
if (process.argv.indexOf('--port') !== -1) {
  port = parseInt(process.argv[process.argv.indexOf('--port') + 1]);
}
let watchDir = process.cwd();
if (process.argv.indexOf('--watch-dir') !== -1) {
  watchDir = process.argv[process.argv.indexOf('--watch-dir') + 1];
}

// fruther process the path based on cwd
if (!path.isAbsolute(watchDir)) {
  watchDir = path.join(watchDir);
}

// start the app
const app = express();
const wsInstance = ws(app);

// setup websocket connection
app.ws('/hot-reload', (socket, req) => {
  socket.on('message', function(msg) {
    socket.send(msg);
  });
});

// create websocket script
app.get('/hot-reload.js', (req, res) => {
  res.header('Content-Type', 'application/javascript').send(`
    "use-strict";
    let websocket = new WebSocket("ws://" + document.location.host + "/hot-reload");

    websocket.onmessage = function(e) {
      if (e.data === 'reload') {
        websocket.close();
        document.location.reload();
      }
    };
  `);
})

// inject script to setup websocket
app.get(`/`, (req, res) => {
  let index = fs.readFileSync(`${watchDir}/index.html`, { encoding: 'utf8'});
  res.send(index.replace('</html>', '<script type="text/javascript" src="/hot-reload.js"></script></html>'));
})

// pass through remaining files untouched
app.use('/', express.static(watchDir));

// stary the server
app.listen(port);

console.log(`Starting watch on ${watchDir}`);
console.log(`open http://localhost:${port} in your browser`);

const watcher = chokidar.watch(`${watchDir}`, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
})

watcher.on('all', (e) => {
  const clients = wsInstance.getWss().clients;
  if (clients.size) {
    console.log('reloading project');
    clients.forEach(socket => {
      socket.send('reload');
    });
  }
})
