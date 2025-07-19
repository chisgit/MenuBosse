// mcp-server/index.js
// MCP server to expose terminal-tool for command execution and port checking

const express = require('express');
const bodyParser = require('body-parser');
const { runCommand, isPortUsed } = require('../mcp-tools/terminal-tool');

const app = express();
app.use(bodyParser.json());

app.post('/run-command', (req, res) => {
  const { command, port } = req.body;
  runCommand(command, port, (err, output) => {
    if (err) {
      res.status(500).json({ error: err.toString(), output });
    } else {
      res.json({ output });
    }
  });
});

app.get('/check-port', (req, res) => {
  const port = parseInt(req.query.port, 10);
  isPortUsed(port, (used) => {
    res.json({ port, used });
  });
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});
