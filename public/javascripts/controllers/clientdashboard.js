'use strict';
wfms.controller("ClientDashboard", function($scope, $rootScope, $modal,
		$location, DataService) {

	$rootScope.userType = "Hospital";
	$scope.getData = function() {
		
		clientInfo();
		getFutureData();
		
	}

<<<<<<< HEAD
=======
	$scope.clientPowerStatus = function(){
		//alert("Power controller called");
		DataService.getData("/api/t",[]).success(function(response){
			//alert("User Type" + $rootScope.userType);
			alert("Data is"+response.data.length);
			for (var i = 0; i < response.data.length; i++) {
				if(($rootScope.userType=="Hospital" && response.data[i].thresholdLevel >1) ||
						($rootScope.userType=="Commercial" && response.data[i].thresholdLevel >5) ||
						($rootScope.userType=="Residential" && response.data[i].thresholdLevel >10))
						{
					$scope.powerStatus ="Red";
				}
				else {
					$scope.powerStatus ="Green";
				}
			}
			//$scope.powerStatus = response.data;
		}).error(function(err){
			console.log(err.message);
		});
		//$scope.clientPowerStatus = response.data[0];
		
	}
	
>>>>>>> 6a0f286aefd2d603029d4835f71903d0922571f6
	function clientInfo(){
		
		//var uri = urlConstants.GET_USER_DETAILS+$rootScope.userId;
		DataService.getData("/api/getClientInfo/7",[]).success(function(response){
			
			//angular.toJson(response);
			console.log(response.data[0]);
			$scope.clientProperties = response.data[0];
			
		}).error(function(err){
			console.log(err.message);
		});
	}
	
	function getFutureData() {
		DataService.postData("/api/getfutureWeather",[]).success(function(response){
			
			//angular.toJson(response);
			console.log(response.data[0]);
			
			
		}).error(function(err){
			console.log(err.message);
		});
		
	}
	
	
	$scope.modifyClientInfo = function(data) {
		console.log("did i get called");

		var modalInstance = $modal.open({
			templateUrl : 'templates/client/editClientInformation.html',
			controller : 'EditBuildingCtrl',
			size : 'lg',
			resolve : {
				isEdit : function(){
					return data;
				}
		
			}
		});

		modalInstance.result.then(function(isValid) {
			if (isValid) {
				getBuilding();
			}
		}, function() {
		});
	};
	
	
});
	

	