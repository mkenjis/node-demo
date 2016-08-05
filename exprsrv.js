global.user_logged = false;

var crypto = require('./helper/crypto');

var sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('mydb.db');

const PORT = 8081;
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var validator = require('express-validator');
app.use(validator());

var cookieParser = require('cookie-parser');
app.use(cookieParser('keyboard cat'));
var cookieSession = require('cookie-session');
app.use(cookieSession({ key: 'key', secret: 'my secret code'}));
var flash = require('express-flash');
app.use(flash());

var path = require('path');
staticpath = path.resolve( __dirname + '/views');

var users = require('./controllers/users')
var sessions = require('./controllers/sessions')

app
.get('/', function(req,res) {
    user_logged = (req.session && req.session.user);
    res.render('static_pages/index');
})
.get('/help', function(req,res) {
    user_logged = (req.session && req.session.user);
    res.send('This is Help page');
})
.get('/about', function(req,res) {
    user_logged = (req.session && req.session.user);
    res.send('This is the About page');
})
.get('/contact', function(req,res) {
    user_logged = (req.session && req.session.user);
    res.send('This is Contact page');
})

// routes for sessions
.get('/sessions/login', sessions.login)
.post('/sessions', sessions.create)
.get('/sessions/logout', sessions.logout)

// routes for users
.get('/users/show', users.show)
.get('/users/new', users.new)
.post('/users', users.create)
.get('/users/:id/edit', users.edit)
.post('/users/:id', users.update)
.get('/users/:id/delete', users.delete)

//app.use(function(req,res,next) {
//    console.log('new request');
//    next();
//})

//app.use(function(req,res) {
//    res.writeHead(200, {'Content-type':'text/html'})
//    res.end('Hello world')
//    console.log('nothing processed');
//})

app.listen(PORT);

console.log('listening on PORT '+PORT);
