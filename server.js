var http = require('http');
var fs = require('fs');
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

app.use('/public', express.static('public'))

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});