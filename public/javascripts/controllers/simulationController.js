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
        var city;
        if ($rootScope.city) {
            city = $rootScope.city;
        } else {
            city = "San Jose"
        }
        var params = {
            city: city,
            country: "US",
            equipment_failure: $scope.equipfailureval
        };
        DataService.postData("/api/getFutureWeather", params).success(function(response) {
            DataService.getData("/api/runRScripts", []).success(function(response) {
                console.log("get the response from R Script" + response)
                DataService.getData("/api/readTextFile/newOutput", []).success(function(response) {
                    $scope.predictedGraph = {
                        options: {
                            chart: {
                                type: 'bar',
                            },
                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: true
                                    },
                                    enableMouseTracking: false
                                }
                            },
                        },
                        yAxis: {
                            title: {
                                text: 'Probablity of Power Outage'
                            }
                        },
                        xAxis: {
                            categories: ['Tomorrow']
                        },
                        title: {
                            text: 'Power Outages in the next week'
                        },
                        series: [{
                            name: 'Probablistic distribution of power outage',
                            data: response.message
                        }]
                    }
                }).error(function(err) {
                    console.log(err.message);
                });
            }).error(function(err) {
                console.log(err.message);
            });
        }).error(function(err) {
            console.log(err.message);
        });
        console.log($scope.equipfailureval);
    };
});