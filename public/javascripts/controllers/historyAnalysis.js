'use strict';
wfms.controller("HistoryAnalysis", function($scope, $rootScope, $modal, $location, DataService) {
    $rootScope.userType = "Hospital";
          
    $scope.getData = function() {
        clientInfo();
        getFutureData();
    };
    $scope.showPieChart1 = function() {
        var modalInstance = $modal.open({
            templateUrl: 'templates/client/chart1.html',
            controller: 'ClientRegistrationController',
            size: 'lg',
        });
        modalInstance.result.then(function(isValid) {
            if (isValid) {
                getData();
            }
        }, function() {});
    };
    $scope.outagesByArea = function() {
        DataService.getData("/api/getOutagesByArea", []).success(function(response) {
            $scope.area = response.Area;
            $scope.pieChart = {
                options: {
                    chart: {
                        type: 'pie',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: 'Power Outages by Area'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    name: "Outages By Area",
                    colorByPoint: true,
                    data: [{
                        name: response.Area[0],
                        y: response.Count[0]
                    }, {
                        name: response.Area[1],
                        y: response.Count[1]
                    }, {
                        name: response.Area[2],
                        y: response.Count[2]
                    }, {
                        name: response.Area[3],
                        y: response.Count[3]
                    }],
                    loading: false
                }]
            }
        }).error(function(err) {
            console.log(err.message);
        });
    }
    $scope.outagesByCause = function() {
        DataService.getData("/api/getOutagesByCause", []).success(function(response) {
            $scope.pieChart2 = {
                options: {
                    chart: {
                        type: 'pie',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: 'Ouatages by Cause'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    name: "Outages By Cause",
                    colorByPoint: true,
                    data: [{
                        name: response.Cause[0],
                        y: response.Count[0]
                    }, {
                        name: response.Cause[1],
                        y: response.Count[1]
                    }, {
                        name: response.Cause[2],
                        y: response.Count[2]
                    }, {
                        name: response.Cause[3],
                        y: response.Count[3]
                    }, {
                        name: response.Cause[4],
                        y: response.Count[4]
                    }, {
                        name: response.Cause[5],
                        y: response.Count[5]
                    }, {
                        name: response.Cause[6],
                        y: response.Count[6]
                    }, {
                        name: response.Cause[7],
                        y: response.Count[7]
                    }],
                    loading: false
                }]
            }
        }).error(function(err) {
            console.log(err.message);
        });
    }
    $scope.recommendations = function() {
        $scope.prediction = {
            options: {
                chart: {
                    type: 'bar'
                }
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Power Outages in the next week'
            },
            subtitle: {
                text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population (millions)'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
            },
            series: [{
                name: 'Population',
                data: [
                    ['Shanghai', 23.7],
                    ['Lagos', 16.1],
                    ['Istanbul', 14.2],
                    ['Karachi', 14.0],
                    ['Mumbai', 12.5],
                    ['Moscow', 12.1],
                ],
                dataLabels: {
                    enabled: true,
                    rotation: 90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.1f}', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        }
    };
    $scope.getOutageData = function() {
        DataService.getData("/api/getPowerOutage", []).success(function(response) {
            $scope.xAxis = response.x;
            $scope.yAxis = response.y;
            $scope.chart2 = {
                options: {
                    chart: {
                        type: 'bar'
                    }
                },
                title: {
                    text: 'Ouatages by Cause'
                },
                xAxis: {
                    type: String,
                    categories: $scope.xAxis,
                    title: {
                        text: 'Causes'
                    }
                },
                yAxis: {
                    title: {
                        text: 'No. of Customers affected'
                    }
                },
                series: [{
                    data: $scope.yAxis
                }],
                loading: false
            }
        }).error(function(err) {
            console.log(err.message);
        });
    }
});

