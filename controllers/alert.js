var dateutil = require('../util/dateutil'),
	moment = require('moment');

createAlert = function(req,res){
	console.log(JSON.stringify(req.body));
	console.log("This Api will be adding the alert");
	console.log(req.body.idbuilding);
	if(!req.body.idbuilding || !req.body.idreport || !req.body.severity || !req.body.date || !req.body.idguard){
		res.status(400).json({status : 400, message : "Bad Request"});
	 } else {

		var queryParam = {
				idbuilding : req.body.idbuilding,
				idreport : req.body.idreport,
				severity : req.body.severity,
				date : req.body.date,
				idguard : req.body.idguard,
				status : 'F',
				seenByClient : 'F'
		}

		mysql.queryDb("INSERT INTO `wfms`.`alertinfo` SET ?", queryParam,function(err,resultAlert){
			if (err) {
				res.status(500).json({ status : 500, message : "Error while retrieving data" });
			} else {
				res.status(200).json({ status : 200, resultAlert:resultAlert });
			}
		});
	}
	
	
}

alertPerBuilding = function(req,res){
	console.log(JSON.stringify(req.body));
	console.log("This Api will be for fetching alerts according to buildings");
	console.log(req.params.idbuilding);
	if(!req.params.idbuilding){
		res.status(400).json({status : 400, message : "Bad Request"});
	} else {
		mysql.queryDb('SELECT wfms.alertinfo.severity, wfms.alertinfo.date, wfms.alertinfo.idalertInfo FROM wfms.alertinfo where ?? = ?;',['idbuilding',req.params.idbuilding],function(err,resultAlert){
			if (err) {
				res.status(500).json({ status : 500, message : "Error while retrieving data" });
			} else {
				res.status(200).json({ status : 200, resultAlert:resultAlert });
			}
		});
	}
}


alertPerClient = function(req,res){
	console.log(JSON.stringify(req.body));
	console.log("This Api will be for fetching alerts according to clients");
	console.log(req.params.idclient);
	if(!req.params.idclient){
		res.status(400).json({status : 400, message : "Bad Request"});
	} else {
		mysql.queryDb('SELECT * FROM wfms.alertinfo left outer join wfms.building on ?? = ?? where ?? = ? AND ?? = ?;',['wfms.building.idbuilding','wfms.alertinfo.idbuilding','idclient',req.params.idclient,'seenByClient','F'],function(err,resultAlert){

			if (err) {
				res.status(500).json({ status : 500, message : "Error while retrieving data" });
			} else {
				res.status(200).json({ status : 200, message : "Report for Alert", resultAlert:resultAlert});
			}
		});
	}
}

seenByClient = function(req,res){

	console.log(JSON.stringify(req.body));
	console.log("This Api will be for changing the status of seenBy client");
	
	if(!req.body.idalertInfo || !req.body.seenByClient){
		res.status(400).json({status : 400, message : "Bad Request"});
	} else {
		mysql.queryDb('UPDATE `wfms`.`alertinfo` SET ??= ? WHERE ?? = ?;',['seenByClient',req.body.seenByClient,'idalertInfo',req.body.idalertInfo],function(err,result){

			if (err) {
				res.status(500).json({ status : 500, message : "Error while retrieving data" });
			} else {
				res.status(200).json({ status : 200, message : "Alert Updated", result:result});
			}
		});
	}


};

alertPerDay = function(req,res){
	
	console.log("This Api is for creating report based on date");
	if(!req.params.date){
		res.status(400).json({status : 400, message : "Bad Request"});
	}else{
		var date = String(req.params.date);
		var fromDate = date + " 00:00:00";
		console
		var untilDate = String(req.params.date);
		untilDate = untilDate + " 23:59:59";
		
		mysql.queryDb("SELECT * FROM wfms.alertinfo where ?? LIKE '"+date+"%'",['date'], function(err, resultAlert) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				
				res.status(200).json({ status : 200, message : "Report for Patrol", resultAlert:resultAlert});
			}
		});
	}
	
}


exports.seenByClient = seenByClient;

activeAdminAlerts= function(req,res){
	mysql.queryDb('select * from alertinfo where status="F" ',function(err,rows){
		if (err) {
			console.log("Error while listing all the guard details !!!"  + err);
			res.status(500).json({ status : 500, message : "Error while listing guard details !!!" });
		} else {
			res.status(200).json({ status : 200, data : rows});
		}
	});
};

seenByAdmin = function(req,res){

	console.log(JSON.stringify(req.body));
	console.log("This Api will be for changing the status alert when seen by admin");
	
	if(!req.body.idalertInfo){
		res.status(400).json({status : 400, message : "Bad Request"});
	} else {
		mysql.queryDb('UPDATE `wfms`.`alertinfo` SET ??= ? WHERE ?? = ?;',['status','T','idalertInfo',req.body.idalertInfo],function(err,result){

			if (err) {
				res.status(500).json({ status : 500, message : "Error while retrieving data" });
			} else {
				res.status(200).json({ status : 200, message : "Alert Updated", result:result});
			}
		});
	}


};


exports.alertPerDay = alertPerDay;
exports.alertPerClient = alertPerClient;
exports.alertPerBuilding = alertPerBuilding
exports.createAlert = createAlert;
exports.activeAdminAlerts = activeAdminAlerts;
exports.seenByAdmin = seenByAdmin;
