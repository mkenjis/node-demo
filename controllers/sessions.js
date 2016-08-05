var crypto = require('../helper/crypto');

exports.login = function(req,res) {
    var errors = req.validationErrors() || [{ param: '', msg: '', value: '' }];
    user_logged = false;
    res.render('sessions/login', {user_logged: user_logged, errors: errors});
}

exports.create = function(req,res) {

    req.checkBody("user_email", "Enter a valid email address").isEmail();
    req.checkBody("user_password", "Enter a valid password").notEmpty().isLength({min:6, max:10});
    
    var errors = req.validationErrors();
    
    if (errors) {
        user_logged = false;
        res.render('sessions/login', {user_logged: user_logged, errors: errors});
    } else {
        var user = req.body;

        global.db.each("select count(*) as cnt from user_info where user_email = '" + user.user_email + "'", 
            function(err, row) {
                if (row.cnt == 0) {
                    errors = [{ param: 'error', msg: 'User does not exist', value: '' }];
                    user_logged = false;
                    res.render('sessions/login', {user_logged: user_logged, errors: errors});
                    console.log("User does not exist");
                    return;
                }

                global.db.each("select password from user_info where user_email = '" + user.user_email + "'", 
                    function(err, row) {
                        if (user.user_password != crypto.decrypt(row.password)) {
                            errors = [{ param: 'error', msg: 'Invalid user email or password', value: '' }];
                            user_logged = false;
                            res.render('sessions/login', {user_logged: user_logged, errors: errors});
                            console.log("Invalid user email or password");
                        } else {
                            //app.use(cookieSession({ key: 'session', secret: user.user_email }))
                            req.session.user = user;
                            req.flash('success', 'User successfully logged');
                            user_logged = true;
                            res.redirect('/');
                            console.log("User successfully logged");
                            console.log(req.session.user.user_email);
                        }
                })
            })
    }
}

exports.logout = function(req,res) {
    req.session.user = null;
    user_logged = false;
    res.redirect('/');
}
