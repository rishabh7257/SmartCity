'use strict';
var wfms = angular.module("wfms", [ 'ngRoute', 'ui.bootstrap','highcharts-ng','nvd3','ui.router' ])
.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl : 'templates/index.ejs',
		controller : 'IndexController'
	}).when('/client', {
		templateUrl : 'templates/client.ejs',
		controller : 'ClientController'
	}).otherwise({
		redirectTo : '/'
	});
	$locationProvider.html5Mode({
		enabled : true,
		requireBase : false
	});
	
	})
	/**
	 * to remove hash in the URL
	 */
	
.run(['$rootScope','$window' ,'$location',  'DataService',function($rootScope,$window, $location,DataService) {
	$rootScope.$on('$routeChangeStart', function(event) {
	});

}]);
//