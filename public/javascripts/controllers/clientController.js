'use strict';
wfms.controller("ClientController", function($scope, $rootScope,
		$location, $window, DataService) {

	$scope.template = "templates/client/clientHome.html";

	$scope.setTemplate = function(tabName){
		$scope.template = "templates/client/"+tabName + ".html";
	}

	$scope.getTemplate = function(){
		return $scope.template;
	};
	
	
});