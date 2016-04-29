'use strict';
wfms.controller("UserEvents", function($scope, $rootScope, $modal, $location, DataService, EventService) {
    $scope.getData = function() {
        $scope.initCal();
        $scope.configureDynamicView($rootScope.postal)
    };
    $scope.configureDynamicView = function configureDynamicView(postal) {
        var url;
        if (postal) {
            url = "/api/getEventsByPostal/" + postal
        } else {
            url = "/api/getEventsByPostal/" + "95126"
        }
        DataService.getData(url, []).success(function(response) {
            $scope.allEvents = EventService.extractEvent(response)
            $scope.eventsCloseToUserEvents();
        }).error(function(err) {
            console.log(err.message);
        });
    }
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
    $scope.eventsCloseToUserEvents = function() {
        console.log("In eventclose to user evetns");
        var url = "/api/comingEvents";
        DataService.getData(url, []).success(function(response) {
            var eventsHeadCount = [];
            var eventsStartDate = [];
            var final = [];
            var todaysDate = new Date();
            for (var i = 0; i < response.length; i++) {
                var day = parseInt(response[i].start_date.split("/")[1]);
                var month = parseInt(response[i].start_date.split("/")[0]);
                var year = parseInt(response[i].start_date.split("/")[2]);
                if ((day == todaysDate.getDate()) && (month == todaysDate.getMonth() + 1) && (year = todaysDate.getFullYear())) {
                    for (var j = 0; j < $scope.allEvents.length; j++) {
                        var d = new Date($scope.allEvents[j].date).getDate();
                        var m = new Date($scope.allEvents[j].date).getMonth() + 1;
                        var y = new Date($scope.allEvents[j].date).getFullYear();
                        if (y == year && m == month) {
                            if ((d - day) <= 3) {
                                console.log("To be pushed HC " + EventService.getPredictedHeadCount($scope.allEvents[j].price));
                                eventsHeadCount.push($scope.allEvents[j].predictedHeadCount);
                                eventsStartDate.push($scope.allEvents[j].date);
                                var value = m + ":" + d + ":" + y + " at " + $scope.allEvents[j].name;
                                var final = [];
                                var temp = {
                                    name: value,
                                    y: $scope.allEvents[j].predictedHeadCount
                                }
                                final.push(temp)
                                $scope.chartsData = final;
                                console.log("After pushed" + eventsStartDate + " Head Count " + eventsHeadCount);
                                console.log("$scope.chartsData" + $scope.chartsData);
                            }
                        }
                    }
                }
            }
            $scope.eventsChart = {
                options: {
                    chart: {
                        type: 'pie',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: 'Power Consumption by events nearby'
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
                    name: "Average power consumption",
                    colorByPoint: true,
                    data: $scope.chartsData,
                    loading: false
                }]
            }
        }).error(function(err) {
            console.log(err.message);
        });
    }
});