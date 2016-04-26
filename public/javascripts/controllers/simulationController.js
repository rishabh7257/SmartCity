'use strict';
wfms.controller("SimulationController", function($scope, $rootScope, DataService, $window, $http) {
    $scope.equipfailure = [{
        val: '0.1',
       
    }, {
        val: '0.2',
       
    }, {
        val: '0.3',
      
    }, {
        val: '0.4',
       
    }, {
        val: '0.5',
       
    }, {
        val: '0.6',
        
    }, {
        val: '0.7',
       
    }, {
        val: '0.8',
        
    }, {
        val: '0.9',
       
    }, {
        val: '1.0',
       
    }];
    
    $scope.predict = function() {


    };
});