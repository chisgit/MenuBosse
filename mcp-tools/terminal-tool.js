// terminal-tool.js
// MCP tool for executing terminal commands and checking port usage

const { exec } = require('child_process');
const net = require('net');

function isPortUsed(port, callback) {
  const server = net.createServer();
  server.once('error', function(err) {
    callback(err.code === 'EADDRINUSE');
  });
  server.once('listening', function() {
    server.close();
    callback(false);
  });
  server.listen(port);
}

function runCommand(command, port, cb) {
  isPortUsed(port, (used) => {
    if (used) {
      cb(null, `Port ${port} is already in use. Server likely running.`);
    } else {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          cb(error, stderr);
        } else {
          cb(null, stdout);
        }
      });
    }
  });
}

module.exports = { runCommand, isPortUsed };
