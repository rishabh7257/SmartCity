'use strict';
wfms.controller("viewReportClientController", function($scope, $rootScope,
		$location, $window, $filter, DataService) {

	
	$scope.getdata = function(req,res) {
		var idperson = 1;
		DataService.getData("/api/listBuilding/"+idperson, []).success(
				function(response) {
					angular.toJson(response);
					//console.log("Response "+ response);
					$scope.buildingName = response.data;
				}).error(function(err) {
			console.log("Error while fetching data");
		});
	}
	
	$scope.getBuilding = function(req,res){

		//var idperson = $rootScope.idperson;

		
	}

	$scope.generateReport = function(buildingName){

		angular.toJson(buildingName);
		console.log("Date :"+ $scope.reportDate);

				//idclient: $rootScope.idclient;
			var params = {
				idclient :  1,
				date_report : $scope.reportDate,
				idbuilding: buildingName.data.idbuilding
			};

		DataService.postData("/api/reportPerClientPerBuilding/", params ).success(
				function(response) {
					console.log("Message: "+response.message);	
					console.log("Status: "+response.status);	
					angular.toJson(response);
					if(response.status == 501 ){
						console.log("Message: "+response.message);
						$scope.error = response.message;
					}
					else{
						angular.toJson(response);
						console.log("Response "+ response.resultAlert + response.resultPatrol);
						
					}
					
				}).error(function(err) {
			console.log("Error while fetching data");

		});

	}



	});