'use strict';
wfms.controller("IndexController", function($scope, $rootScope,
		$location, $window, DataService) {

	$scope.template = "templates/index/index.html";

	$scope.setTemplate = function(tabName){
		$scope.template = "templates/index/"+tabName + ".html";
	}

	$scope.getTemplate = function(){
		return $scope.template;
	};
	
});