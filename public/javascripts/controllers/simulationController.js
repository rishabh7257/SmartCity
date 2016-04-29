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
        $rootScope.methodCalled = true;
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
                     DataService.getData("/api/readTextFile/newOutputRounded", []).success(function(response) {
                        console.log("response.message" + response.message)
                        console.log("RootScope User Type" + $rootScope.userType)
                        for (var i = 0; i < response.message.length; i++) {
                            if (($rootScope.userType == "Hospital" && response.message[i] > 0.3) || ($rootScope.userType == "Commercial" && response.message[i] > 0.5) || ($rootScope.userType == "Residential" && response.message[i] > 0.7)) {
                                $scope.powerStatus = "Red";
                            } else {
                                $scope.powerStatus = "Green";
                            }
                        }
                        console.log("RootScope powerStatus " + $scope.powerStatus)
                    }).error(function(err) {
                        console.log(err.message);
                    });
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