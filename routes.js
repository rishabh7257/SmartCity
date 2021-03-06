var loginController = require('./controllers/login');
var clientController = require('./controllers/client');
var utilController = require('./controllers/util');
var eventsController = require('./controllers/events');
var historyController = require('./controllers/tibco');
var calendarController = require('./controllers/calendar');

var nodeRBridge = require('./controllers/nodeRBridge');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var child;
module.exports = function(app, passport) {

    // Home
    app.get('/', function(req, res) {
        res.render("index");
    });
    app.get(['/home', '/logout'], ensureAuthenticated, function(req, res) {
        res.render("index");
    });
    // Auth
    app.post('/api/register', loginController.register);
    app.get('/api/login', function(req, res) {
        res.render("index");
    });
    app.post('/api/login', loginController.checkLogin);
    app.get('/api/loggedin', loginController.loggedin);
    app.post('/api/logout', loginController.logout);
    // Client
    app.get('/api/getClient/:idperson', ensureAuthenticated, clientController.getClient);
    app.get('/api/getClientInfo/:idperson', clientController.getClientInfo);
    app.get('/api/getClientInfo/:idperson', ensureAuthenticated, clientController.getClientInfo);
    app.get('/front', function(req, res) {
        res.render("front");
    });
    //Modifying

    app.get('/api/getPowerOutage',historyController.getPowerOutage);
    app.get('/api/getOutagesByArea',historyController.getOutagesByArea);

    app.get('/api/getOutagesByCause',historyController.getOutagesByCause);
    app.get('/sendMail',clientController.sendMail);
    app.get('/api/createUserEvents',calendarController.createUserEvents);
    app.get('/data',calendarController.getUserEvents);
    app.post('/data',calendarController.addUserEvents);
    app.get('/api/comingEvents',eventsController.getEventsAroundUserEvents);

    app.get('/graph', function(req,res){ res.render("googleCharts"); });


    //Util
    app.get('/api/getLongLat/:city', ensureAuthenticated, utilController.getLongLat);
    app.get('/api/getDate/:dateTime', ensureAuthenticated, utilController.getDate);
    app.get('/api/getTime/:dateTime', ensureAuthenticated, utilController.getTime);
    //Events
    app.get('/api/getEventsByCity/:city', ensureAuthenticated, eventsController.getEventsByCity);
    app.get('/api/getEventsByPostal/:postal', ensureAuthenticated, eventsController.getEventsByPostal);
    //RScripts
    app.get('/api/runRScripts', nodeRBridge.runRScripts);
    app.post('/api/getFutureWeather', nodeRBridge.getFutureWeather);
    app.get('/api/readTextFile/:filename', nodeRBridge.readTextFile);
    //Elastick beanstalk healthcheck
    app.get('/health', function(req, res) {
        res.send(200);
    });
    app.get('/templates/:file', function(req, res) {
        var file = req.params.file;
        res.render('templates/' + file);
    });
    //For Admin templates
    app.get('/templates/admin/:file', function(req, res) {
        var file = req.params.file;
        res.render('templates/admin/' + file);
    });
    //For Index templates
    app.get('/templates/index/:file', function(req, res) {
        var file = req.params.file;
        res.render('templates/index/' + file);
    });
    //Auth Middleware
    function ensureAuthenticated(req, res, next) {
        // if (req.isAuthenticated())
        {
            return next();
        }
    }
};