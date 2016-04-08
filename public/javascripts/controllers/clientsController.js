'use strict';
wfms.controller("ClientsCtrl", function($scope, $rootScope, DataService) {

	$scope.getAllClients = function(){
		DataService.getData(urlConstants.GET_ALL_CLIENTS,[]).success(function(response){
			if(response.data){
				console.log(response.data);
				$scope.clientListResults = response.data;
			}
		}).error(function(err){
			console.log(err.message);
		});
	}
});
