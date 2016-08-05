exports.current_user = function(user_email, callback) {
    //console.log('current_user = '+user_email)
    global.db.serialize(function() {
        global.db.each("select count(*) as cnt from user_info where user_email = '" + user_email + "'", 
        function(err, row) {
            //console.log('row.cnt = '+row.cnt)
            //console.log('row.cnt > 0 :'+(row.cnt > 0))
            callback (row.cnt > 0);
        });
    });
}
