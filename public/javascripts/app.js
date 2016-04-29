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

.run(['$rootScope','$window' ,'$location',  'DataService', 'EventService', function($rootScope,$window, $location, DataService, EventService) {
	$rootScope.$on('$routeChangeStart', function(event) {
	});

}]);
//