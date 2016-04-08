var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
mysql = require('../models/mysql');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
    	//console.log('serializeUser' + user.idperson + ":" + user.username);
        try{
            done(null, user.idperson);
        } catch(e){
            console.log(e);
            console.log('serializeUser:: ' + user.idperson + ":" + user.username);
        }
    });

    passport.deserializeUser(function(user_id, done) {
        
    	mysql.queryDb('select * from login where idperson = ?',[user_id],function(err,rows){
    		if(err) {
    			//console.log('deserializeUser' + err);
    			return done(err);
    		} else {
                //console.log('rows', rows[0]);
    			return done(null, (typeof(rows[0]) != "undefined") ? rows[0] : false);
    		}
    	});
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },function(email, password, done) {
    	mysql.queryDb('select * from login where email = ?',[email],function(err,rows){
        		if(err) {
    			console.log('Error while fetching login:' + err);
    			return done(err);
    		} else {
    			if(rows==null || rows==''){
    				console.log('   ' + err);
    				return done(null, false, { 'message': 'No user with this username and password exists.'});
    			} else {
	    			var sa = rows[0].password_salt;
	                var pw = rows[0].password_hash;
	                var upw = crypto.createHmac('sha1', sa).update(password).digest('hex');
	                if(upw == pw) {
                        //console.log("Done");
	                    return done(null, rows[0]);
	                }
	                return done(null, false, { 'message': 'Invalid password. '});
    			}
    		}
    	});    	
    }));
};
