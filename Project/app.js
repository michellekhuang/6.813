#!/usr/bin/env node

const http = require('http');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const handlebars = exphbs({
  extname: '.html',
  partialsDir: 'views/',
});

app.get('/', (req, res, next) => res.render('login'));

app.use(express.static(__dirname));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', handlebars);
app.set('view engine', 'html');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
