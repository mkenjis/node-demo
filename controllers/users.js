var crypto = require('../helper/crypto');
var sess_helper = require('../helper/session_helper');

exports.show = function(req,res){
    var i = 0;
    var userList = [];
    
    sess_helper.current_user(req.session.user, function(user_logged) {
        if (!user_logged) {
            req.flash('success', 'Please login');
            res.redirect('/sessions/login');
        } else {
            global.db.serialize(function() {
                global.db.each("select user_email,first_name,last_name,password from user_info", function(err,row) { 
                    userList[i] = {"user_email": row.user_email,
                                   "first_name": row.first_name,
                                   "last_name": row.last_name,
                                   "user_password": row.password};
                    i = i+1;
                }, 
                function() {
                    res.render('users/show', { user_logged: user_logged, userList: userList, expressFlash: req.flash('success') });
                });
            });
        };
    });
};

exports.new = function(req,res) {
    var errors = req.validationErrors() || [{ param: '', msg: '', value: '' }];
    sess_helper.current_user(req.session.user, function(user_logged) {
        if (!user_logged) {
            req.flash('success', 'Please login');
            res.redirect('/sessions/login');
        } else {
            res.render('users/new', { user_logged: user_logged, errors: errors});  
        };
    });
};

exports.create = function(req,res) {
    
    sess_helper.current_user(req.session.user, function(user_logged) {
        if (!user_logged) {
            req.flash('success', 'Please login');
            res.redirect('/sessions/login');
        } else {
            req.checkBody("first_name", "Enter a valid first name").notEmpty();
            req.checkBody("last_name", "Enter a valid last name").notEmpty();
            req.checkBody("user_email", "Enter a valid email address").isEmail();
            req.checkBody("user_password", "Enter a valid password").notEmpty().isLength({min:6, max:10});
            
            var errors = req.validationErrors();
        
            if (errors) {
                res.render('users/new', { user_logged: user_logged, errors: errors});
            } else {
                var user = req.body;
        
                global.db.each("select count(*) as cnt from user_info where user_email = '" + user.user_email + "'", 
                    function(err, row) {
                        if (row.cnt > 0) {
                            req.flash('success', 'User email already exists');
                            res.redirect('users/show');
                            console.log("User email already exists");
                        } else {
                            global.db.run('begin transaction');
                            global.db.run('insert into user_info(user_email,first_name,last_name,password) values (?,?,?,?)',
                                    user.user_email,user.first_name,user.last_name,crypto.encrypt(user.user_password));
                            global.db.run('end');
                            
                            req.flash('success', 'User successfully created');
                            res.redirect('users/show');      
                            console.log("User successfully created");
                        };
                    });
            };
        };
    });
};

exports.edit = function(req,res) {
    sess_helper.current_user(req.session.user, function(user_logged) {
        if (!user_logged) {
            req.flash('success', 'Please login');
            res.redirect('/sessions/login');
        } else {
            var errors = req.validationErrors() || [{ param: '', msg: '', value: '' }];
            var user_email = req.params.id;
        
            global.db.each("select user_email,first_name,last_name,password from user_info where user_email='" + user_email + "'", 
                function(err,row) {
                        res.render('users/edit', { user_logged: user_logged,
                                iduser: row.user_email,
                                prinome: row.first_name,
                                ultnome: row.last_name,
                                pwduser: row.password,
                                errors: errors});
                });
        };
    });
};

exports.update = function(req,res) {
    sess_helper.current_user(req.session.user, function(user_logged) {
        if (!user_logged) {
            req.flash('success', 'Please login');
            res.redirect('/sessions/login');
        } else {
            req.checkBody("first_name", "Enter a valid first name").notEmpty();
            req.checkBody("last_name", "Enter a valid last name").notEmpty();
            req.checkBody("user_password", "Enter a valid password").notEmpty().isLength({min:6, max:10});
                
            var errors = req.validationErrors();
            var user_email = req.params.id;
            var user = req.body;
        
            if (errors) {
                res.render('users/edit', { user_logged: user_logged,
                        iduser: user_email,
                        prinome: user.first_name,
                        ultnome: user.last_name,
                        pwduser: user.user_password,
                        errors: errors});   
            } else {
                var user_email = req.params.id;
                var user = req.body;
                
                global.db.each("select count(*) as cnt from user_info where user_email = '" + user_email + "'", 
                    function(err, row) {
                        if (row.cnt == 0) {
                            req.flash('success', 'User does not exist');
                                res.redirect('users/show');
                            console.log("User does not exist");
                        } else {
                            global.db.run('begin transaction');
                            global.db.run("update user_info set first_name = ?, last_name = ?, password = ? where user_email = '" + user_email + "'",
                                    user.first_name,user.last_name,crypto.encrypt(user.user_password));
                            global.db.run('end');
        
                            req.flash('success', 'User successfully updated');
                            res.redirect('show');
                            console.log("User successfully updated");
                        };
                    });
            };
        };
    });
};

exports.delete = function(req,res) {
    sess_helper.current_user(req.session.user, function(user_logged) {
        if (!user_logged) {
            req.flash('success', 'Please login');
            res.redirect('/sessions/login');
        } else {
            var user_email = req.params.id;
        
            global.db.each("select count(*) as cnt from user_info where user_email = '" + user_email + "'", 
                function(err, row) {
                    if (row.cnt == 0) {
                        req.flash('success', 'User does not exist');
                        res.redirect('users/show'); 
                        console.log("User does not exist");
                    } else {
                        global.db.run('begin transaction');
                        global.db.run("delete from user_info where user_email = '" + user_email + "'");
                        global.db.run('end');
        
                        req.flash('success', 'User successfully deleted');
                        res.redirect('users/show');
                        console.log("User successfully deleted");
                    };
                });
        };
    });
};
