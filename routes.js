var loginController = require('./controllers/login');
var clientController = require('./controllers/client');
var utilController = require('./controllers/util');
var eventsController = require('./controllers/events');
var historyController = require('./controllers/tibco');
var calendarController = require('./controllers/calendar');

module.exports = function (app, passport) {

    // Home
    app.get('/', function(req,res){ res.render("index"); });
    app.get(['/home','/logout'], ensureAuthenticated, function(req,res){ res.render("index"); });

    // Auth
    app.post('/api/register', loginController.register);
    app.get('/api/login', function(req,res){ res.render("index"); });
    app.post('/api/login', loginController.checkLogin);
    app.get('/api/loggedin',loginController.loggedin);
    app.post('/api/logout', loginController.logout);

    // Client
    app.get('/api/getClient/:idperson', ensureAuthenticated, clientController.getClient);
    app.get('/api/getClientInfo/:idperson', clientController.getClientInfo);
    app.get('/api/t/', clientController.powerStatus);

    app.get('/api/getClientInfo/:idperson', ensureAuthenticated, clientController.getClientInfo);

    app.get('/front', function(req,res){ res.render("front"); });
    //Modifying
    app.get('/api/getPowerOutage',historyController.getPowerOutage);
    app.get('/api/getOutagesByArea',historyController.getOutagesByArea);

    app.get('/api/getOutagesByCause',historyController.getOutagesByCause);

    app.get('/api/createUserEvents',calendarController.createUserEvents);
    app.get('/data',calendarController.getUserEvents);
    app.post('/data',calendarController.addUserEvents)

    app.get('/graph', function(req,res){ res.render("googleCharts"); });

    //Util
    app.get('/api/getLongLat/:city', ensureAuthenticated, utilController.getLongLat);
    app.get('/api/getDate/:dateTime', ensureAuthenticated, utilController.getDate);
    app.get('/api/getTime/:dateTime', ensureAuthenticated, utilController.getTime);


    //Events
    app.get('/api/getEventsByCity/:city', ensureAuthenticated, eventsController.getEventsByCity);
    app.get('/api/getEventsByPostal/:postal', ensureAuthenticated, eventsController.getEventsByPostal);


//    // Admin
//    //app.post('/api/createAlert' ,adminController.createAlert);
//    app.post('/api/publishAlert',adminController.publishAlert);
//    app.post('/api/addPatrolRecord',adminController.addPatrolRecord );
//    //app.put('/api/createReport',reportController.createReport);


//    //Rishabh
//    app.post('/api/createReport', ensureAuthenticated, reportController.createReport);
//    app.get('/api/reportPerBuilding/:idbuilding', ensureAuthenticated, reportController.reportPerBuilding);
//    app.post('/api/reportPerClientPerBuilding/', ensureAuthenticated, reportController.reportPerClientPerBuilding);
//    app.get('/api/reportPerClient/:idclient', ensureAuthenticated, reportController.reportPerClient);
//    app.get('/api/reportPerDay/:date', ensureAuthenticated, reportController.reportPerDay);
//    app.get('/api/reportPerGuard/:idguard', ensureAuthenticated, reportController.reportPerGuard);
//
//    app.post('/api/createAlert', ensureAuthenticated, alertController.createAlert);
//    app.get('/api/alertPerBuilding/:idbuilding', ensureAuthenticated, alertController.alertPerBuilding);
//    app.get('/api/alertPerClient/:idclient', ensureAuthenticated, alertController.alertPerClient);
//    app.get('/api/alertPerDay/:date', ensureAuthenticated, alertController.alertPerDay);
//
//    app.put('/api/alert/seenByClient', ensureAuthenticated, alertController.seenByClient);
//    app.put('/api/alert/seenByAdmin', ensureAuthenticated, alertController.seenByAdmin);
//
//
//
//    app.get('/api/activeAdminAlerts', ensureAuthenticated, alertController.activeAdminAlerts);
//
//
//
//    //Guard
//    app.post('/api/createGuard', ensureAuthenticated, guardController.createGuard);
//    app.put('/api/updateGuard/:idguard', ensureAuthenticated, guardController.updateGuard);
//    app.get('/api/listAllGuards', ensureAuthenticated, guardController.listAllGuards);
//    app.delete('/api/deleteGuard/:idguard', ensureAuthenticated, guardController.deleteGuard);
//    app.get('/api/getGuard/:idguard', ensureAuthenticated, guardController.getGuard);
//    app.get('/api/searchGuard',ensureAuthenticated, guardController.searchGuard);
//
//
//
//    //Building
//
//    //app.get(('/api/getBuildingClientReport/:idperson', buildingController.getBuildingClientReport);
//
//    app.get('/api/getBuildingClientReport/:idperson', buildingController.getBuildingClientReport);
//
//    app.get('/api/listBuilding/:idperson', buildingController.getBuilding);
//    app.post('/api/createBuilding', buildingController.createBuilding);
//    app.put('/api/editBuilding', buildingController.editBuilding);
//    app.delete('/api/deleteBuilding/:buildingid', buildingController.deleteBuilding);


    //Elastick beanstalk healthcheck
    app.get('/health',function(req,res){ res.send(200); });

    app.get('/templates/:file',function(req,res){
        var file = req.params.file;
        res.render('templates/' + file);
    });

    //For Admin templates
    app.get('/templates/admin/:file',function(req,res){
        var file = req.params.file;
        res.render('templates/admin/' + file);
    });

    //For Index templates
    app.get('/templates/index/:file',function(req,res){
        var file = req.params.file;
        res.render('templates/index/' + file);
    });
 
    //Auth Middleware

    function ensureAuthenticated(req, res, next) {
       // if (req.isAuthenticated())
    	{
            return next();

            //Rishabh Sanghvi
//        } else {
//            //res.redirect('/login');
//           res.status(401).json({message : "Unauthorized access !!"});

    //   } else {
            //res.redirect('/login');
      //  	res.status(401).json({message : "Unauthorized access !!"});


        }
       }
};
