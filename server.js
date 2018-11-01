"use strict";
var express = require('express');
var app = express();
app.use('/',express.static(__dirname + '/'));
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("server Running at http://localhost:3000/");
});
var http = require('http');
var server = http.createServer(function(request, response) { });