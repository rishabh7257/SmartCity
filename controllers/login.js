	var crypto = require('crypto');
var passport = require('passport');
var moment = require('moment');
var dateutil = require('../util/dateutil');

exports.register = function(req, res) {
    //var vpw = req.body.vpw;
    console.log("registerPost inside");
    var pwu = req.body.password;
    var un = req.body.email;
    var fn = req.body.fname;
    var ln = req.body.lname;
    var orgname = req.body.orgname;
    var usertype = req.body.usertype;
    var address = req.body.address;
    var city = req.body.city;
    var zipcode = req.body.zipcode;
    var phonenumber = req.body.phonenumber;

    req.checkBody('email', 'Please enter a valid email.').notEmpty().isEmail();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        var msg = errors[0].msg;
        res.status(400).json({
            status : 400,
            message : msg
        });
    }
    
    var new_salt = Math.round((new Date().valueOf() * Math.random())) + '';
    var pw = crypto.createHmac('sha1', new_salt).update(pwu).digest('hex');
    var created = dateutil.now();
    
    var data={
        email:un,
        password_hash:pw,
        status:true,
        type:usertype,
        created_date:created,
        last_login:created,
        password_salt:new_salt
    };

    mysql.queryDb('insert into login set ?',data,function(err,result){
      if(err) {
        console.log(err);
            res.status(500).json({ status : 500, message : "Please try again later" });
      } else {
            
        var idperson = result.insertId;

        mysql.queryDb('insert into person set ?',{idperson: idperson,fname : fn,
                  lname : ln,
                  email : un,
                  address: address,
                  city:city,
                  zipcode:zipcode,
                  phonenumber:phonenumber
                  },
        function(err,result){
          if(err) {
            res.status(500).json({ status : 500, message : "Please try again later" });
          } else {
            req.session.idperson = idperson;
            passport.authenticate('local')(req, res, function () {
                           lastLogin = new Date();
                           req.session.email = un;

                          res.status(200).json({
                              status : 200,
                              idperson : idperson,
                              email : un,
                              name : req.body.fname + " " + req.body.lname,
                              lastLogin : lastLogin.toDateString() + " " + lastLogin.toLocaleTimeString()
                          });
              });
          }
        });
      }
    });
};

exports.checkLogin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.log(err);
            res.status(500).json({status:500,message : info.message + "Please try again later"});
        }
        if(!user) {
           console.log(err);
            res.status(401).json({status:401,message : info.message + "Please try again later"}); 
        }
        req.logIn(user, function(err) {
            if (err) {
                console.log(err);
                res.status(500).json({status:500,message : err + "Please try again later"});
            }
            var last_login = moment(user.last_login).format('LLL');
            req.session.last_login = last_login;
            req.session.idperson = user.idperson;
            req.session.email = user.username;
            console.log(moment(user.last_login).format('LLL'));

            //Async Query
            mysql.queryDb('update login set ? where ?',[{last_login:new Date()},{idperson:user.idperson}],function(err,result){
            if(err) {
              console.log(err);
            }
          });
            
            mysql.queryDb("select fname, lname from person where ?",[{idperson:user.idperson}],function(err,result){
                if(err) {
                    console.log(err);
                    res.status(500).json({status:500,message : "Please try again later"});
                } else {
                    res.status(200).json({status:200, idperson:user.idperson, email:user.username, name : result[0].fname  + ' ' + result[0].lname, lastLogin:last_login});
                }
            });            
        });
    })(req, res, next);
};

exports.logout = function(req, res) {
    req.logout();
    res.send(200);
};

// route to test if the user is logged in or not 
exports.loggedin = function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0'); 
};
