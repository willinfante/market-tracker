var http = require('http');
var fs = require('fs');
var express = require('express');
var hostname = '127.0.0.1';
var port = 3000;

app = express();
app.use('/static', express.static('public'))

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});