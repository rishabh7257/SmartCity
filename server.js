var express = require('express');
var expressValidator = require('express-validator');
var ejs = require('ejs');
var passport = require('passport');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieSession = require('cookie-session');
var path = require('path');
var mysql = require('./models/mysql');
var mongo = require('./models/mongo');
//checking the changes made @SwatiK
var sinchSms = require('sinch-sms')({
    key: '54c1af62-92cc-4ea4-9001-ddbc9b7e01b0',
    secret: 'rM2QyCXbv0S8EqcOYhEpPg=='
});

var app = express();
var io=require('socket.io');
var client = require('twilio')('ACe10877080547b663607bc260a5497f96','e881954b0748ab08c1521ec487155af6');
 //var smtpTransport = require("nodemailer-smtp-transport");
var eventful = require('eventful-node');
var express=require('express');
var nodemailer = require("nodemailer");
var app=express();

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'notificationsforpoweroutage@gmail.com',
        pass: 'smartcity'
    }
});

console.log('SMTP Configured');
/*app.get('/sendMail',function(req,res) {
    var maillist = [
        'er.poojashukla07@gmail.com',
       ' poo.shukla@sjsu.edu'
    ];
    var msg = {
        subject: "Alert - Power Outage",
        text: "There is an outage predicted in your area tomorrow!"
    }
   // console.log(mailOptions);
    maillist.forEach(function (to, i, array) {
        msg.to = to;

        smtpTransport.sendMail(msg, function (err) {
            if (err) {
                console.log('Sending to ' + to + ' failed: ' + err);
                return;
            } else {
                console.log('Sent to ' + to);
            }

        });
        /!*  smtpTransport.sendMail(mailOptions, function(error, response){
         if(error){
         console.log(error);
         res.end("error");
         }else{
         console.log("Message sent: " + response.message);
         res.render("index");
         }
         });*!/
    });
});*/
/*app.get('/testtwilio',function(req,res){
   /!* sinchSms.createSmsVerification (+14083345829);
    verification.initiate(success, fail);*!/
       sinchSms.send('+16692219847', 'Alert !! Power Outage').then(function(response) {
       //All good, response contains messageId
       console.log(response);
   }).fail(function(error) {
       // Some type of error, see error object
       console.log(error);
   });
});*/
app.get('/testtwilio',function(req,res){
    client.sendMessage({
        to: '+16692219847',
        from: '+13862774125',
        body: 'Hello from Twilio'
    },function(err, data){
        if(err)
            console.log(err);
        console.log(data);
    });
});

app.get('/sms', function(req,res){
    text.send('+16692219847', 'A sample text message!', undefined, function(err) {
        if (err) {
            console.log(err);
        }
    });
});

app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(expressValidator());
app.use(morgan('dev'));
app.use(cookieSession({ secret: '@cMpE@7#' , cookie: { maxAge: 60000 }}));
app.use(passport.initialize());

app.use(passport.session());
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname , 'views'));
app.use(express.static(__dirname + '/public'));
//Authentication
require('./util/auth')(passport);

//API endpoints
require('./routes')(app, passport);

//If request does not map to any route redirect to default route.
app.get('*', function(req, res){
    res.render("index");
});

//Connection pool initialization
mysql.createConnPool();
app.listen(app.get('port'), function() {
    console.log('%s: Node server started on %d ...', Date(Date.now()), app.get('port'));
});

//Test code...will move in separate JS -- Pooja



    /*... skipping similar code for other test events...*/




