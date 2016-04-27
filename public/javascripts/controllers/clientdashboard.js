'use strict';
wfms.controller("ClientDashboard", function($scope, $rootScope, $modal, $location, DataService, $window) {
    $rootScope.userType = "Hospital";
    $scope.getData = function() {
        clientInfo();
        $scope.getWeatherData();
        $scope.predictNextWeekOutage()
    };
    $scope.initCal = function() {
        scheduler.init('scheduler_here', new Date(2016, 3, 16), "month");
        scheduler.templates.xml_date = function(value) {
            return new Date(value);
        };
        scheduler.load("/data", "json");
        var dp = new dataProcessor("/data");
        dp.init(scheduler);
        dp.setTransactionMode("POST", false);
    }
    $scope.predictNextWeekOutage = function() {
        var city;
        if ($rootScope.city) {
            city = $rootScope.city;
        } else {
            city = "San Jose"
        }
        var params = {
            city: city,
            country: "US"
        };
        DataService.postData("/api/getFutureWeather", params).success(function(response) {
            DataService.getData("/api/runRScripts", []).success(function(response) {
                console.log("get the response from R Script" + response)
                DataService.getData("/api/readTextFile/newOutput", []).success(function(response) {
                    $scope.predictedGraph = {
                        options: {
                            chart: {
                                type: 'line',
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
                            categories: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh']
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
    }
    $scope.addPoints = function() {
        var seriesArray = $scope.chart2.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };
    $scope.addSeries = function() {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chart2.series.push({
            data: rnd
        })
    }
    $scope.removeRandomSeries = function() {
        var seriesArray = $scope.chart2.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }
    $scope.options = {
        type: 'line'
    }
    $scope.swapChartType = function() {
        if (this.chart2.options.chart.type === 'line') {
            this.chart2.options.chart.type = 'bar'
        } else {
            this.chart2.options.chart.type = 'line'
        }
    }
    $scope.chart1 = {
        options: {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Status Counts in the Current Stage.'
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
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Microsoft Internet Explorer',
                y: 56.33
            }, {
                name: 'Chrome',
                y: 24.03
            }, {
                name: 'Firefox',
                y: 10.38
            }, {
                name: 'Safari',
                y: 4.77
            }, {
                name: 'Opera',
                y: 0.91
            }, {
                name: 'Proprietary or Undetectable',
                y: 0.2
            }]
        }],
        loading: false
    }
    $scope.clientPowerStatus = function() {
        DataService.getData("/api/t", []).success(function(response) {
            for (var i = 0; i < response.data.length; i++) {
                if (($rootScope.userType == "Hospital" && response.data[i].thresholdLevel > 1) || ($rootScope.userType == "Commercial" && response.data[i].thresholdLevel > 5) || ($rootScope.userType == "Residential" && response.data[i].thresholdLevel > 10)) {
                    $scope.powerStatus = "Red";
                } else {
                    $scope.powerStatus = "Green";
                }
            }
        }).error(function(err) {
            console.log(err.message);
        });
    }

    function clientInfo() {
        var uri = "/api/getClientInfo/" + $rootScope.idperson;
        DataService.getData(uri, []).success(function(response) {
            var data = response.data[0];
            console.log(JSON.stringify(response, null, " "));
            $scope.clientProperties = response.data[0];
            $rootScope.userId = response.data[0].email;
            $rootScope.userName = response.data[0].name;
            $rootScope.userLastLogin = response.data[0].lastLogin;
            $rootScope.city = response.data[0].city;
            $rootScope.postal = response.data[0].zipcode;
        }).error(function(err) {
            console.log(err.message);
        });
    }

    function getFutureData() {
        DataService.postData("/api/getfutureWeather", []).success(function(response) {
            console.log(response.data[0]);
        }).error(function(err) {
            console.log(err.message);
        });
    }
    $scope.modifyClientInfo = function(data) {
        console.log("did i get called");
        var modalInstance = $modal.open({
            templateUrl: 'templates/client/editClientInformation.html',
            controller: 'EditClientProfileCtrl',
            size: 'lg',
            resolve: {
                isEdit: function() {
                    return $scope.clientProperties
                }
            }
        });
        modalInstance.result.then(function(isValid) {
            if (isValid) {
                clientInfo();
            }
        }, function() {});
    };
    $scope.getWeatherData = function() {
        console.log("getWeatherData()");
        var country = $window.sessionStorage.country.replace(/ /g, '_');;
        var state = $window.sessionStorage.state.replace(/ /g, '_');
        var city = $window.sessionStorage.city.replace(/ /g, '_');
        var location = 'https:%2F%2Fwww.yr.no%2Fplace%2F' + country + '%2F' + state + '%2F' + city + '%2F' + 'forecast_hour_by_hour.xml';
        $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?url=' + location + '&callback=?', function(xml) {
            window.meteogram = new Meteogram(xml, 'container');
        });
    };
    $scope.sendMail = function() {
        var uri = "/sendMail";
        DataService.getData(uri, []).success(function(response) {
            console.log("Api called");
        }).error(function(err) {
            console.log(err.message);
        });
    };
});