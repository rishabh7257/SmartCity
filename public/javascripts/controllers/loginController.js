'use strict';
wfms.controller("LoginController", function($scope, $rootScope,
		$location, $window, DataService) {

	$scope.template = "templates/wfms.html";
	$scope.getTemplate = function(){
		return $scope.template;
	};
	 $scope.signInFormError = "";

	 $scope.signIn = function() {
	 	if ($scope.loginForm.email.$invalid || $scope.loginForm.pwd.$invalid) {
	 		$scope.signInFormError = "Invalid Credentials";
	 	} else {
	 		var params = {
	 			email : $scope.email,
	 			password : $scope.pwd
	 		};
	 		DataService.postData(urlConstants.LOGIN, params).success(
	 				function(response) {
	 					
	 					console.log("Response" + response.city);
	 					$window.sessionStorage.userId = response.email;
	 					$window.sessionStorage.userName = response.name;
	 					$window.sessionStorage.userLastLogin = response.lastLogin;
	 					$rootScope.userId = response.email;
	 					$rootScope.userName = response.name;
	 					$rootScope.userLastLogin = response.lastLogin;
	 					$rootScope.city = response.city;
	 					$location.path('/home');
	 				}).error(function(err) {
	 			$scope.signInFormError = err.message;
	 		});
	 	}
	 }
});