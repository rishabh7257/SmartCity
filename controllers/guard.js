var dateutil = require('../util/dateutil'),
	moment = require('moment');


createGuard = function(req,res){
	
	console.log(JSON.stringify(req.body));
	
	if(!req.body.idperson || !req.body.start_date || !req.body.end_date || !req.body.weekly_working_set || !req.body.bgstatus){
		res.status(400).json({status : 400, message : "Bad Request"});
	}else{
		var formDate = moment(req.body.start_date,'DD-MM-YYYY').toDate();
		var toDate = moment(req.body.end_date,'DD-MM-YYYY').toDate();

		var queryParam = {
				idguard : req.body.idguard,
				idperson : req.body.idperson,
				start_date : formDate,
				end_date : toDate,
				weekly_working_set : req.body.weekly_working_set,
				bgstatus: req.body.bgstatus
		}

		mysql.queryDb("INSERT INTO guard SET ?", queryParam, function(err, response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				res.status(200).json({ status : 200, message : "Guard has been added Succesfully" });
			}
		});
	}
};


updateGuard = function(req,res){
	if(!req.body.idperson || !req.body.start_date || !req.body.end_date){
		res.status(400).json({ status : 400, message : "Bad Request" });
	}else{
		var newParam ={
			
				weekly_working_set : req.body.weekly_working_set,
				bgstatus: req.body.bgstatus,
				start_date :moment(req.body.start_date,'DD-MM-YYYY').toDate(), 
				end_date : moment(req.body.end_date,'DD-MM-YYYY').toDate()
		};
		
		console.log(req.params.idguard);
		
		mysql.queryDb("UPDATE guard SET ? WHERE ?? = ?", 
			[newParam,'idguard',req.params.idguard], 
			function(err, response) {
			if (err) {
				console.log("Error while perfoming query !!!" + err);
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				res.status(200).json({ status : 200, message : "Guard has been updated Succesfully" });
			}
		});
	}
};



listAllGuards=function(req,res){
	mysql.queryDb('select * from guard left join person on guard.idperson = person.idperson',function(err,rows){
		if (err) {
			console.log("Error while listing all the guard details !!!"  + err);
			res.status(500).json({ status : 500, message : "Error while listing guard details !!!" });
		} else {
			res.status(200).json({ status : 200, data : rows});
		}
	});
};


deleteGuard=function(req,res){
	console.log(JSON.stringify(req.body));
	if(!req.params.idguard){
		res.status(400).json({ status : 400, message : "Bad Request" });
	}else{
		
		idguard = req.params.idguard
		
		mysql.queryDb('DELETE FROM guard WHERE ?',[{idguard:idguard}],function(err,response){
			if (err) {
				console.log("Error while deleting guard details !!!");
				console.log(err);
				res.status(500).json({ status : 500, message : "Error while deleting guard details !!!" });
			} else {
				res.status(200).json({ status : 200, message : "Guard details has been deleted Succesfully" });
			}
		});
	}
};


getGuard=function(req,res){
	
	if(!req.params.idguard){
		res.status(400).json({ status : 400, message : "Bad Request" });
	}else{ 
		
		idguard = req.params.idguard,
		mysql.queryDb('SELECT * FROM guard WHERE ?',[{idguard:idguard}],function(err,rows){

			if (err) {
				res.status(500).json({ status : 500, message : "Error while retrieving data" });
			} else {
				res.status(200).json({ status : 200, data : rows });
			}
		});
	}
};


//Will use filter in angular on these names returned

searchGuard=function(req,res){
	mysql.queryDb('select concat(?? , " " , ??) as name, ?? from person left outer join login on ?? = ?? where login.type= "Guard"',['person.fname','person.lname','person.email','person.idperson','login.idperson','Guard'],function(err,rows){
		if (err) {
			console.log("Error while listing all the guard details !!!"  + err);
			res.status(500).json({ status : 500, message : "Error while listing guard details !!!" });
		} else {
			res.status(200).json({ status : 200, data : rows});
		}
	});
};



	

exports.createGuard = createGuard;
exports.updateGuard=updateGuard;
exports.listAllGuards=listAllGuards;
exports.deleteGuard=deleteGuard;
exports.getGuard = getGuard;
exports.searchGuard=searchGuard


