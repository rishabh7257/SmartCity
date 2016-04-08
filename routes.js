var loginController = require('./controllers/login');
var clientController = require('./controllers/client');
var adminController = require('./controllers/admin');
var reportController = require('./controllers/report');
var alertController = require('./controllers/alert');
var guardController = require('./controllers/guard');
var buildingController = require('./controllers/building');

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
    app.get('/api/listAllClients', ensureAuthenticated, clientController.listAllClients);
    app.put('/api/updateClient', ensureAuthenticated, clientController.updateClient);
    app.post('/api/createClient', ensureAuthenticated, clientController.createClient);
    app.delete('/api/deleteClient', ensureAuthenticated, clientController.deleteClient);
    app.post('/api/updateClientBillingInfo', ensureAuthenticated, clientController.updateClientBillingInfo);
    app.get('/api/getClientInfo/:idperson', ensureAuthenticated, clientController.getClientInfo);
  
    // Admin
    //app.post('/api/createAlert' ,adminController.createAlert);
    app.post('/api/publishAlert',adminController.publishAlert);
    app.post('/api/addPatrolRecord',adminController.addPatrolRecord );
    //app.put('/api/createReport',reportController.createReport);

    
    //Rishabh
    app.post('/api/createReport', ensureAuthenticated, reportController.createReport);
    app.get('/api/reportPerBuilding/:idbuilding', ensureAuthenticated, reportController.reportPerBuilding);
    app.post('/api/reportPerClientPerBuilding/', ensureAuthenticated, reportController.reportPerClientPerBuilding);
    app.get('/api/reportPerClient/:idclient', ensureAuthenticated, reportController.reportPerClient);
    app.get('/api/reportPerDay/:date', ensureAuthenticated, reportController.reportPerDay);
    app.get('/api/reportPerGuard/:idguard', ensureAuthenticated, reportController.reportPerGuard);
    
    app.post('/api/createAlert', ensureAuthenticated, alertController.createAlert);
    app.get('/api/alertPerBuilding/:idbuilding', ensureAuthenticated, alertController.alertPerBuilding);
    app.get('/api/alertPerClient/:idclient', ensureAuthenticated, alertController.alertPerClient);
    app.get('/api/alertPerDay/:date', ensureAuthenticated, alertController.alertPerDay);

    app.put('/api/alert/seenByClient', ensureAuthenticated, alertController.seenByClient);
    app.put('/api/alert/seenByAdmin', ensureAuthenticated, alertController.seenByAdmin);
    
   

    app.get('/api/activeAdminAlerts', ensureAuthenticated, alertController.activeAdminAlerts);
    

    
    //Guard
    app.post('/api/createGuard', ensureAuthenticated, guardController.createGuard);
    app.put('/api/updateGuard/:idguard', ensureAuthenticated, guardController.updateGuard);
    app.get('/api/listAllGuards', ensureAuthenticated, guardController.listAllGuards);
    app.delete('/api/deleteGuard/:idguard', ensureAuthenticated, guardController.deleteGuard);
    app.get('/api/getGuard/:idguard', ensureAuthenticated, guardController.getGuard);
    app.get('/api/searchGuard',ensureAuthenticated, guardController.searchGuard);
    

    
    //Building

    //app.get(('/api/getBuildingClientReport/:idperson', buildingController.getBuildingClientReport);

    app.get('/api/getBuildingClientReport/:idperson', buildingController.getBuildingClientReport);

    app.get('/api/listBuilding/:idperson', buildingController.getBuilding);
    app.post('/api/createBuilding', buildingController.createBuilding);
    app.put('/api/editBuilding', buildingController.editBuilding);
    app.delete('/api/deleteBuilding/:buildingid', buildingController.deleteBuilding);

    
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
