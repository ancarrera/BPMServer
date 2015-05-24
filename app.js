var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('underscore');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var app  = express();

var uri = "mongodb://127.0.0.1:27017/BPMtest";
global.db = mongoose.connect(uri);

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var test = require('./test/testdb');
var ModelSchemas = require('./db/modelschemas');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) { // Override metodos de los formularios para PUT Y DELETE.
        var method = req.body._method;
        delete req.body._method;
        return method
    }
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(test);
app.use(routes);
app.use(users);
app.use(login);

app.listen("8080");

