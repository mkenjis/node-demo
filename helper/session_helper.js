exports.current_user = function(user, callback) {
    //console.log(user)
    if (!user) {
        callback (false)
    } else {
        global.db.serialize(function() {
            global.db.each("select count(*) as cnt from user_info where user_email = '" + user.user_email + "'", 
            function(err, row) {
                //console.log('row.cnt = '+row.cnt)
                //console.log('row.cnt > 0 :'+(row.cnt > 0))
                callback (row.cnt > 0);
            });
        });
    };
}
