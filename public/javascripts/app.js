'use strict';
var wfms = angular.module("wfms", [ 'ngRoute', 'ui.bootstrap' ])
.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl : 'templates/index.ejs',
		controller : 'IndexController'
	}).when('/client', {
		templateUrl : 'templates/client.ejs',
		controller : 'ClientController'
	}).when('/guard', {
		templateUrl : 'templates/guard.ejs',
		controller : 'GuardController'
	}).when('/admin', {
		templateUrl : 'templates/admin.ejs',
		controller : 'AdminController'
	}).otherwise({
		redirectTo : '/'
	});
	/**
	 * to remove hash in the URL
	 */
	$locationProvider.html5Mode({
		enabled : true,
		requireBase : false
	});

})
.run(['$rootScope','$window' ,'$location', 'DataService',function($rootScope,$window, $location,DataService) {
	$rootScope.$on('$routeChangeStart', function(event) {


		/*DataService.postData(urlConstants.IS_LOGGED_IN,[]).success(function(response){

		// DataService.postData(urlConstants.IS_LOGGED_IN,[]).success(function(response){


		// 	if($window.sessionStorage.userId){
		// 		$rootScope.userId = $window.sessionStorage.userId;
		// 		$rootScope.userName = $window.sessionStorage.userName;
		// 		$rootScope.userLastLogin = $window.sessionStorage.userLastLogin;
		// 		$location.path('/home');
		// 	}
		// 	else{
		// 		$location.path('/');
		// 	}


		}).error(function(err){
			if($window.sessionStorage.userId){
				var params = {
						email : $window.sessionStorage.userId
				};
				DataService.postData(urlConstants.LOGOUT, params).success(
						function(response) {
							$location.path('/');
							$window.sessionStorage.userId = undefined;
							$window.sessionStorage.userName = undefined;
							$window.sessionStorage.userLastLogin = undefined;
						}).error(function(err) {
							console.log("Error while session validity");
						});
			}else{
				$location.path('/');
			}
		});
*/

		// }).error(function(err){
		// 	if($window.sessionStorage.userId){
		// 		var params = {
		// 				email : $window.sessionStorage.userId
		// 		};
		// 		DataService.postData(urlConstants.LOGOUT, params).success(
		// 				function(response) {
		// 					$location.path('/');
		// 					$window.sessionStorage.userId = undefined;
		// 					$window.sessionStorage.userName = undefined;
		// 					$window.sessionStorage.userLastLogin = undefined;
		// 				}).error(function(err) {
		// 					console.log("Error while session validity");
		// 				});
		// 	}else{
		// 		$location.path('/');
		// 	}
		// });


		
	});

}]);