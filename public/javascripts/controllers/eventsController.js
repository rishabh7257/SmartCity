'use strict';
wfms.controller("eventsController", function($scope, $rootScope, $modal, $location, DataService, EventService,$window) {
    $scope.getData = function() {
       // $scope.configureDynamicView($rootScope.postal);
        $scope.configureDynamicView($window.sessionStorage.postal);
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
            $scope.series();
        }).error(function(err) {
            console.log(err.message);
        });
    }
    $scope.series = function series() {
        var allData = $scope.allEvents;
        var seriesData = []
        allData.forEach(function(e) {
            if (!seriesData[e.date]) {
                if (e.predictedHeadCount > 0) {
                    seriesData[e.date] = e.predictedHeadCount
                }
            } else {
                if (e.predictedHeadCount > 0) {
                    seriesData[e.date] = seriesData[e.date] + e.predictedHeadCount
                }
            }
        });
        var final = [];
        for (var eventNew in seriesData) {
            var temp = {
                key: eventNew,
                y: seriesData[eventNew]
            }
            final.push(temp)
        }
        $scope.seriesData = final;
        $scope.options = {
            title: {
                enable: true,
                text: 'Electricity usage for next one Week'
            },
            // subtitle options
            subtitle: {
                enable: true,
                text: 'Depicts Electricity consumption for next week',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d) {
                    return d.key;
                },
                y: function(d) {
                    return d.y;
                },
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelType: 'percent',
                labelSunbeamLayout: true
            }
        };
        $scope.data = $scope.seriesData
        $scope.chart2 = {
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
                data: $scope.seriesData
            }],
            loading: false
        }
    }
});