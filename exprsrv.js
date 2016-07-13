var sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('mydb.db');
global.userList = [];

const PORT = 8081;
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app
.get('/help', function(req,res) {
    res.send('This is Help page');
})
.get('/about', function(req,res) {
    res.send('This is the About page');
})
.get('/contact', function(req,res) {
    res.send('This is Contact page');
})
.get('/users/show', function(req,res){
    var i = 0;
    global.userList = [];
    global.db.serialize(function() {
    global.db.each("select first_name,last_name,user_email from user_info", function(err,row) { 
        userList[i] = {"first_name": row.first_name,
                       "last_name": row.last_name,
                       "user_email": row.user_email};
        //console.log(global.userList[i].first_name + ', ' + global.userList[i].last_name);
        i = i+1;
    }, 
    function() {
        //for (i = 0; i < 5; i++) { 
        //    console.log(global.userList[i]); 
        //}
        res.render('show');
    });
    });
})
.get('/users/new', function(req,res) {
    res.render('new');
})
.post('/users', function(req,res) {
    var user = req.body;
    
    global.db.each("select count(*) as cnt from user_info where user_email = '" + user.user_email + "'", 
        function(err, row) {
            if (row.cnt > 0) {
                res.writeHead(200, {'Content-type':'text/html'});
                res.end('User already exists');
                console.log("User already exists");
            } else {
                global.db.run('begin transaction');
                global.db.run('insert into user_info(user_email,first_name,last_name) values (?,?,?)',
                        user.user_email,user.first_name,user.last_name);
                global.db.run('end');
                
                res.writeHead(200, {'Content-type':'text/html'});
                res.end('User successfully created');
                console.log("User successfully created");
            }
        })
        
    global.db.each("select first_name,last_name,user_email from user_info", function(err,row) {
        console.log('User = '+row.first_name + ',' + row.last_name);
    })
    //console.log(global.db);
})


app.use(function(req,res,next) {
    console.log('new request');
    next();
})

app.use(function(req,res) {
    res.writeHead(200, {'Content-type':'text/html'})
    res.end('Hello world')
    console.log('nothing processed');
})

app.listen(PORT);

console.log('listening on PORT '+PORT);
