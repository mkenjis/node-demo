exports.show = function(req,res){
    var i = 0;
    var userList = [];
    
    global.db.serialize(function() {
        global.db.each("select first_name,last_name,user_email from user_info", function(err,row) { 
            userList[i] = {"first_name": row.first_name,
                           "last_name": row.last_name,
                           "user_email": row.user_email};
            i = i+1;
        }, 
        function() {
            res.render('users/show', { userList: userList });
        });
    });
};

exports.new = function(req,res) {
    res.render('users/new');
};

exports.create = function(req,res) {
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
                
                //res.writeHead(200, {'Content-type':'text/html'});
                //res.end('User successfully created');
                res.redirect('/users/show');
                console.log("User successfully created");
            }
        })
        
    global.db.each("select first_name,last_name,user_email from user_info", function(err,row) {
        console.log('User = '+row.first_name + ',' + row.last_name);
    })
};

exports.edit = function(req,res) {
    var user_email = req.params.id;
    global.db.each("select first_name,last_name,user_email from user_info where user_email='" + user_email + "'", 
        function(err,row) {
            res.render('users/edit', { iduser: row.user_email,
                       prinome: row.first_name,
                       ultnome: row.last_name });
        });
};

exports.update = function(req,res) {
    var user_email = req.params.id;
    var user = req.body;
    
    global.db.each("select count(*) as cnt from user_info where user_email = '" + user_email + "'", 
        function(err, row) {
            if (row.cnt == 0) {
                res.writeHead(200, {'Content-type':'text/html'});
                res.end('User does not exist');
                console.log("User does not exist");
            } else {
                global.db.run('begin transaction');
                global.db.run("update user_info set first_name = ?, last_name = ? where user_email = '" + user_email + "'",
                        user.first_name,user.last_name);
                global.db.run('end');
                
                //res.writeHead(200, {'Content-type':'text/html'});
                //res.end('User successfully updated');
                //req.flash('info', 'User successfully updated');
                //res.render('users/show');
                //res.redirect('/users/show', {flashMsg: req.flash('info', 'User successfully updated') });
                res.redirect('/users/show');
                console.log("User successfully updated");
            }
        })
};

exports.delete = function(req,res) {
    var user_email = req.params.id;
    global.db.each("select count(*) as cnt from user_info where user_email = '" + user_email + "'", 
        function(err, row) {
            if (row.cnt == 0) {
                res.writeHead(200, {'Content-type':'text/html'});
                res.end('User does not exist');
                console.log("User does not exist");
            } else {
                global.db.run('begin transaction');
                global.db.run("delete from user_info where user_email = '" + user_email + "'");
                global.db.run('end');
                
                //res.writeHead(200, {'Content-type':'text/html'});
                //res.end('User successfully deleted');
                res.redirect('/users/show');
                console.log("User successfully deleted");
            }
        })
};
