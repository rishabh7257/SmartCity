var dateutil = require('../util/dateutil'),
        moment = require('moment');

reportPerClientPerBuilding = function(req,res){
        console.log(JSON.stringify(req.body));
        console.log("This Api will be for fetching alerts and patrols according to buildings and date");
        //var reportdate = moment(req.body.date_report,"MM-DD-YYYY");
        //date_report = date_report.substring(0, 10);
        var reportdate = req.body.date_report.toString();
        reportdate = reportdate.substring(0,10);
        console.log("reportdate: "+reportdate);
        console.log(Object.prototype.toString.call(req.body.date_report));
        if(!req.body.idbuilding || !reportdate || !req.body.idclient){
                res.status(400).json({status : 400, message : "Bad Request"});
        } else {
                mysql.queryDb('SELECT * from wfms.report left outer join wfms.building on report.idbuilding = building.idbuilding where ?? = ? AND ?? = ? AND ?? = ?;',['report.date',""+reportdate+"",'building.idclient',req.body.idclient,'report.idbuilding',req.body.idbuilding], function(err, result) {
                if (err) {
                        console.log("Error while perfoming query !!!");
                        res.status(500).json({ status : 500, message : "Please try again later" });
                } else {
                        if(result.length == 0){
                                console.log("printing status 500 when no report found");
                                res.status(200).json({ status : 501, message : "No Report for selected date and building" });
                        }
                        else{
                                mysql.queryDb("SELECT * FROM wfms.patrol where ?? = ?",['idreport',result[0].idreport], function(err, resultPatrol) {
                                if (err) {
                                        console.log("Error while perfoming query !!!");
                                        res.status(500).json({ status : 500, message : "Please try again later" });
                                } else {
                                        mysql.queryDb("SELECT * FROM wfms.alertinfo where ?? = ?",['idreport',result[0].idreport], function(err, resultAlert) {
                                                if (err) {
                                                        console.log("Error while perfoming query !!!");
                                                        res.status(500).json({ status : 500, message : "Please try again later" });
                                                } else {

                                                        res.status(200).json({ status : 200, message : "Report for Building", resultAlert:resultAlert, resultPatrol:resultPatrol});
                                                }
                                        });


                                }
                        });
                        }

                }
        });
        }

}
createReport = function(req,res){
        console.log(JSON.stringify(req.body));
        console.log("This API will be returning Report Id for the corresponding guard and building id");
        if(!req.body.idguard || !req.body.idbuilding){
                res.status(400).json({status : 400, message : "Bad Request"});
        }else{
                //var date = new Date();

                //var date = moment(new Date(),myString());
                //var date = moment(new Date(),'YYYY-MM-DD');

                var date = moment().format('YYYY-MM-DD');
                console.log(date);

                var queryParam = {
                                date : date,
                                idguard:req.body.idguard,
                                idbuilding:req.body.idbuilding
                }

                mysql.queryDb("SELECT * FROM wfms.report where ?? = ? AND ?? = ? AND ?? = ?;",['idbuilding',req.body.idbuilding,'idguard',req.body.idguard,'date',date], function(err, result) {
                        if (err) {
                                console.log("Error while perfoming query !!!");
                                res.status(500).json({ status : 500, message : "Please try again later" });
                        } else if(result[0]){

                                res.status(200).json({ status : 200, message : "Report already exsist, sending report id for reference",idreport:result[0].idreport});
                        } else{

                                mysql.queryDb("INSERT INTO wfms.report SET ?", queryParam, function(err, result) {
                                        if (err) {
                                                console.log("Error while perfoming query !!!");
                                                res.status(500).json({ status : 500, message : "Please try again later" });
                                        } else {
                                                res.status(200).json({ status : 200, message : "New report is been created", idreport:result.insertId });
                                        }
                                });

                        }

                });
        }

}

reportPerGuard = function(req,res) {
        console.log(JSON.stringify(req.body));
        console.log("This Api will be for fetching alerts and patrols per gaurd");
        console.log(req.params.idguard);
        if(!req.params.idguard){
                res.status(400).json({status : 400, message : "Bad Request"});
        } else {
                mysql.queryDb("SELECT * FROM wfms.patrol where ?? = ?",['idguard',req.params.idguard], function(err, resultPatrol) {
                        if (err) {
                                console.log("Error while perfoming query !!!");
                                res.status(500).json({ status : 500, message : "Please try again later" });
                        } else {
                                mysql.queryDb("SELECT * FROM wfms.alertinfo where ?? = ?",['idguard',req.params.idguard], function(err, resultAlert) {
                                        if (err) {
                                                console.log("Error while perfoming query !!!");
                                                res.status(500).json({ status : 500, message : "Please try again later" });
                                        } else {

                                                res.status(200).json({ status : 200, message : "Report per gaurd", resultAlert:resultAlert, resultPatrol:resultPatrol});
                                        }
                                });


                        }
                });
        }

}

reportPerBuilding = function(req,res){
        console.log(JSON.stringify(req.body));
        console.log("This Api will be for fetching alerts and patrols according to buildings");
        console.log(req.params.idbuilding);
        if(!req.params.idbuilding){
                res.status(400).json({status : 400, message : "Bad Request"});
        } else {
                mysql.queryDb("SELECT * FROM wfms.report where ?? = ?",['idbuilding',req.params.idbuilding], function(err, result) {
                if (err) {
                        console.log("Error while perfoming query !!!");
                        res.status(500).json({ status : 500, message : "Please try again later" });
                } else {

                        mysql.queryDb("SELECT * FROM wfms.patrol where ?? = ?",['idreport',result[0].idreport], function(err, resultPatrol) {
                                if (err) {
                                        console.log("Error while perfoming query !!!");
                                        res.status(500).json({ status : 500, message : "Please try again later" });
                                } else {
                                        mysql.queryDb("SELECT * FROM wfms.alertinfo where ?? = ?",['idreport',result[0].idreport], function(err, resultAlert) {
                                                if (err) {
                                                        console.log("Error while perfoming query !!!");
                                                        res.status(500).json({ status : 500, message : "Please try again later" });
                                                } else {

                                                        res.status(200).json({ status : 200, message : "Report for Building", resultAlert:resultAlert, resultPatrol:resultPatrol});
                                                }
                                        });


                                }
                        });

                }
        });
        }
}


reportPerClient = function(req,res){
        console.log(JSON.stringify(req.body));
        var outputary = "";
        console.log("This Api will be for fetching alerts and patrols according to clients");
        console.log(req.params.idclient);
        if(!req.params.idclient){
                res.status(400).json({status : 400, message : "Bad Request"});
        } else {
                mysql.queryDb('SELECT * FROM wfms.patrol left outer join wfms.building on ?? = ?? where ?? = ?;',['wfms.patrol.idbuilding','wfms.building.idbuilding','idclient',req.params.idclient],function(err,resultPatrol){

                        if (err) {
                                res.status(500).json({ status : 500, message : "Error while retrieving data" });
                        } else {
                                mysql.queryDb('SELECT wfms.alertinfo.severity, wfms.alertinfo.date, wfms.alertinfo.idalertInfo FROM wfms.patrol left outer join wfms.building on  ?? = ?? left outer join wfms.alertinfo on ?? = ?? where ?? = ?;',['wfms.patrol.idbuilding','wfms.building.idbuilding','wfms.alertinfo.idreport','wfms.patrol.idreport','idclient',req.params.idclient],function(err,resultAlert){
                                        if (err) {
                                                res.status(500).json({ status : 500, message : "Error while retrieving data" });
                                        } else {
                                                res.status(200).json({ status : 200, resultPatrol : resultPatrol, resultAlert:resultAlert });
                                        }
                                });
                        }
                });
        }
}

reportPerDay = function(req,res){

        console.log("This Api is for creating report based on date");
        if(!req.params.date){
                res.status(400).json({status : 400, message : "Bad Request"});
        }else{
                var date = String(req.params.date);
                var fromDate = date + " 00:00:00";
                console
                var untilDate = String(req.params.date);
                untilDate = untilDate + " 23:59:59";

                mysql.queryDb('SELECT * FROM wfms.patrol where ?? BETWEEN ? AND ?',['date', fromDate, untilDate], function(err, resultPatrol) {
                        if (err) {
                                console.log("Error while perfoming query  !!!");
                                res.status(500).json({ status : 500, message : "Please try again later" });
                        } else {
                                mysql.queryDb("SELECT * FROM wfms.alertinfo where ?? LIKE '"+date+"%'",['date'], function(err, resultAlert) {
                                        if (err) {
                                                console.log("Error while perfoming query !!!");
                                                res.status(500).json({ status : 500, message : "Please try again later" });
                                        } else {

                                                res.status(200).json({ status : 200, message : "Report for Patrol", resultPatrol : resultPatrol, resultAlert:resultAlert});
                                        }
                                });

                        }
                });
        }

}
exports.reportPerClientPerBuilding = reportPerClientPerBuilding;
exports.reportPerGuard = reportPerGuard;
exports.reportPerDay = reportPerDay;
exports.reportPerClient = reportPerClient;
exports.reportPerBuilding = reportPerBuilding
exports.createReport = createReport;