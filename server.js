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
var app = express();
var io=require('socket.io');

var eventful = require('eventful-node');

//Weather
var Forecast = require('forecast');

//Initialize 
var forecast = new Forecast({
  service: 'forecast.io',
  key: '0f5451632f4990d7998a6a5b5bb2acbc',
  units: 'celcius', // Only the first letter is parsed 
  cache: true,      // Cache API requests? 
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
    minutes: 27,
    seconds: 45
    }
});

forecast.get([-33.8683, 151.2086], function(err, weather) {
	  if(err) return console.dir(err);
	  console.dir(weather);
	});
	 
	// Retrieve weather information, ignoring the cache 
	forecast.get([-33.8683, 151.2086], true, function(err, weather) {
	  if(err) return console.dir(err);
	  console.dir(weather);
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
