'use strict';
wfms.controller("ClientController", function($scope, $rootScope,
		$location, $window, DataService) {

	// $scope.template = "templates/wfms.html";
	// $scope.getTemplate = function(a){

	// 	return $scope.template;
	// };
	$scope.template = "templates/client/clientHome.html";

	//$scope.clientName = $rootScope.fname;
	$scope.setTemplate = function(tabName){
		$scope.template = "templates/client/"+tabName + ".html";
	}

	$scope.getTemplate = function(){
		
		return $scope.template;
	};
	
	
});