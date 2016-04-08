'use strict';
wfms.controller("ClientDashboard", function($scope, $rootScope, $modal,
		$location, DataService) {

	$scope.getData = function() {
		
		clientInfo();
		
	}
	


	
	
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
	

	