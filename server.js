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

var app = express();

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

//PopulateCache
//cache.populateCache();
app.listen(app.get('port'), function() {
    console.log('%s: Node server started on %d ...', Date(Date.now()), app.get('port'));
});
