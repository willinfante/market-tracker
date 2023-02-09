var http = require('http');
var fs = require('fs');
const path = require('path');
var express = require('express');
var hostname = '127.0.0.1';
var port = 3000;

app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/main.html'));
});

app.get('/russia', (req, res) => {
  res.sendFile(path.join(__dirname, '/russiamain.html'));
});

app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, '/chart.html'));
});

app.use('/public', express.static('public'))

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//12:3
