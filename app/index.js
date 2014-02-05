#!/usr/bin/env node
'use strict';

var path = require('path');
var express = require('express');

var app = express();
var controllers = require('./controllers');

app.set('port', parseInt(process.env.NODE_PORT));
app.set('views', path.jon(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '822faa4e-c080-45d3-b735-4740e6b695ae'}));
app.use(express.csrf());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.listen(app.get('port'));
