'use strict';
wfms.controller("ShowClientRegisController", function($scope, $rootScope, $modal,
		$location, DataService,$window) {
	
	$scope.registerClient = function() {
		console.log("inside register Client");

		var modalInstance = $modal.open({
			templateUrl : 'templates/index/register.html',
			controller : 'ClientRegistrationController',
			size : 'lg',
		});

		modalInstance.result.then(function(isValid) {
			if (isValid) {
				getData();
			}
		}, function() {
		});
	};

	$scope.loginClient = function() {

		console.log("Inside login client Funct");
		if($scope.email=== "" ||  $scope.password === ""){
			$scope.formError = "Form Invalid !!!";
		}else{
			
			var params = {
					
					email : $scope.email,
					password:  $scope.password
						
				};
			DataService.postData("/api/login",params).success(
				function(response) {
					console.log("Login Successful");
				}).error(function(err) {
			console.log("Error while fetching data");
		});
		}
	};
	
	
	
});
	
	