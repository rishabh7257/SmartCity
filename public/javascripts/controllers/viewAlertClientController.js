'use strict';
wfms.controller("viewAlertClientController", function($scope, $rootScope,
		$location, $window, DataService) {

	$scope.getAlert = function(){
		DataService.getData("/api/alertPerClient/1", []).success(
				function(response) {
					$scope.alert = response.resultAlert;
				}).error(function(err) {
			console.log("Error while fetching data");
		});
	};

	$scope.seen = function(alertinfo){
		console.log(angular.isObject(alertinfo));
		angular.toJson(alertinfo);
		console.log(alertinfo.data.idalertInfo);
		console.log("Id Alert: "+ alertinfo);
		var params = {
				idalertInfo : alertinfo.data.idalertInfo,
				seenByClient : 'T'
				
			};

		DataService.putData("/api/alert/seenByClient",params).success(function(response){
				console.log("Done Successfully");


			}).error(function(err){
				console.log("Error");
			});
			this.getAlert();
		
	}
	// $scope.signInFormError = "";

	// $scope.signIn = function() {
	// 	if ($scope.loginForm.email.$invalid || $scope.loginForm.pwd.$invalid) {
	// 		$scope.signInFormError = "Invalid Credentials";
	// 	} else {
	// 		var params = {
	// 			email : $scope.email,
	// 			password : $scope.pwd
	// 		};
	// 		DataService.postData(urlConstants.LOGIN, params).success(
	// 				function(response) {
	// 					*
	// 					 * For encrypting password at client side as well
	// 					 * $scope.pwd =
	// 					 * CryptoJS.SHA256($scope.pwd).toString(CryptoJS.enc.hex);
						 
	// 					$window.sessionStorage.userId = response.email;
	// 					$window.sessionStorage.userName = response.name;
	// 					$window.sessionStorage.userLastLogin = response.lastLogin;
	// 					$rootScope.userId = response.email;
	// 					$rootScope.userName = response.name;
	// 					$rootScope.userLastLogin = response.lastLogin;
	// 					$location.path('/home');
	// 				}).error(function(err) {
	// 			$scope.signInFormError = err.message;
	// 		});
	// 	}
	// }
});