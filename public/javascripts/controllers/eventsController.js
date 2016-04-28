'use strict';
wfms.controller("eventsController", function($scope, $rootScope, $modal, $location, DataService) {
    $scope.getData = function() {
        $scope.configureDynamicView();
    };
    $scope.configureDynamicView = function configureDynamicView() {
        var url = "/api/getEventsByPostal/" + $rootScope.postal
            //      var url = "/api/getEventsByPostal/95126"
        DataService.getData(url, []).success(function(response) {
            $scope.extractEvent(response);
        }).error(function(err) {
            console.log(err.message);
        });
    }
    $scope.extractEvent = function extractEvent(data) {
        var events = data.data.search.events.event;
        console.log(events);
        var tableRow = events.length;
        var eventArray = [];
        var arr = [];
        for (var i = 0; i < tableRow; i++) {
            var eachEvent = {
                'date': $scope.getDate(events[i].start_time),
                'time': $scope.getTime(events[i].start_time),
                'address': events[i].venue_address,
                'city': events[i].city_name,
                'name': events[i].venue_name,
                'predictedHeadCount': $scope.getPredictedHeadCount(events[i].price)
            }
            eventArray.push(eachEvent);
            arr.push(events[i]);
            $rootScope.eventData = arr;
            //  console.log("Event Date is " + $rootScope.eventData);
            $scope.allEvents = eventArray
            $scope.series();
            console.log(JSON.stringify($scope.allEvents));
            if (Number.isNaN(100)) {
                console.log("Number");
            }
        }
    }
    $scope.getPredictedHeadCount = function getPredictedHeadCount(price) {
        if (price) {
            var predictedHeadCount = "";
            if (price[0] == '$') {
                price = price.slice(1)
            }
            for (var i = 0; i < price.length; i++) {
                if (price[i] == " ") {
                    console.log(predictedHeadCount);
                    return ((parseInt(predictedHeadCount) * 100) / 10);
                } else {
                    predictedHeadCount = predictedHeadCount + price[i];
                }
            }
        } else {
            return 0;
        }
    }
/*<<<<<<< HEAD

    $scope.EventsCloseToUserEvents = function EventsCloseToUserEvents(){
        var url = "/api/comingEvents";
        DataService.getData(url, []).success(function(response) {
            var eventData = $rootScope.eventData;
            var eventsHeadCount = [];
            var eventsStartDate = [];
            var final = [];
            var todaysDate = new Date();
            for(var i =0; i < response.length; i++) {
                var day = parseInt(response[i].start_date.split("/")[1]);
                var month = parseInt(response[i].start_date.split("/")[0]);
                var year = parseInt(response[i].start_date.split("/")[2]);
                if( (day == todaysDate.getDate()) && (month == todaysDate.getMonth()+1) && (year = todaysDate.getFullYear())) {
                    for (var j = 0; j < $rootScope.eventData.length; j++) {
                        var d = new Date($rootScope.eventData[j].start_time).getDate();
                        var m = new Date($rootScope.eventData[j].start_time).getMonth() + 1;
                        var y = new Date($rootScope.eventData[j].start_time).getFullYear();
                        if (y == year && m == month) {
                            if ((d - day) <= 3) {
                                console.log("To be pushed HC " + $scope.getPredictedHeadCount($rootScope.eventData[i].price));
                                eventsHeadCount.push($scope.getPredictedHeadCount($rootScope.eventData[i].price));
                                eventsStartDate.push($rootScope.eventData[i].start_time);
                                var value = m+":"+d+":"+y+" at "+$rootScope.eventData[j].venue_name;
                                var final = [];
                                var temp = {
                                    name: value,
                                    y: $scope.getPredictedHeadCount($rootScope.eventData[j].price)
                                }
                                final.push(temp)
                                $scope.chartsData = final;
                                console.log("After pushed" + eventsStartDate + " Head Count " + eventsHeadCount);
=======
 */   $scope.EventsCloseToUserEvents = function EventsCloseToUserEvents() {
            var url = "/api/comingEvents";
            DataService.getData(url, []).success(function(response) {
                var eventData = $rootScope.eventData;
                var eventsHeadCount = [];
                var eventsStartDate = [];
                var final = [];
                var todaysDate = new Date();
                for (var i = 0; i < response.length; i++) {
                    var day = parseInt(response[i].start_date.split("/")[1]);
                    var month = parseInt(response[i].start_date.split("/")[0]);
                    var year = parseInt(response[i].start_date.split("/")[2]);
                    if ((day == todaysDate.getDate()) && (month == todaysDate.getMonth() + 1) && (year = todaysDate.getFullYear())) {
                        for (var j = 0; j < $rootScope.eventData.length; j++) {
                            var d = new Date($rootScope.eventData[j].start_time).getDate();
                            var m = new Date($rootScope.eventData[j].start_time).getMonth() + 1;
                            var y = new Date($rootScope.eventData[j].start_time).getFullYear();
                            if (y == year && m == month) {
                                if ((d - day) <= 3) {
                                    console.log("To be pushed HC " + $scope.getPredictedHeadCount($rootScope.eventData[i].price));
                                    eventsHeadCount.push($scope.getPredictedHeadCount($rootScope.eventData[i].price));
                                    eventsStartDate.push($rootScope.eventData[i].start_time);
                                    var value = m + ":" + d + ":" + y + " at " + $rootScope.eventData[j].venue_name;
                                    var final = [];
                                    var temp = {
                                        name: value,
                                        y: $scope.getPredictedHeadCount($rootScope.eventData[j].price)
                                    }
                                    final.push(temp)
                                    $scope.chartsData = final;
                                    console.log("After pushed" + eventsStartDate + " Head Count " + eventsHeadCount);
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
        /* $scope.extractEvent = function extractEvent(data) {
             var events = data.data.search.events.event;
             console.log(events);
             var tableRow = events.length;
             var eventArray = [];
             for (var i = 0; i < tableRow; i++) {
                 var eachEvent = {
                     'date': $scope.getDate(events[i].start_time),
                     'time': $scope.getTime(events[i].start_time),
                     'address': events[i].venue_address,
                     'city': events[i].city_name,
                     'name': events[i].venue_name,
                     'predictedHeadCount': $scope.getPredictedHeadCount(events[i].price)
                 }
                 eventArray.push(eachEvent);
                 console.log("Event Date is "+$scope.getDate(events[i].start_time));


             $scope.allEvents = eventArray
             $scope.series();
             console.log(JSON.stringify($scope.allEvents));
             if (Number.isNaN(100)) {
                 console.log("Number");
             }
         }*/
    $scope.getDate = function getDate(dateTime) {
        return dateTime.slice(0, 10);
    }
    $scope.getTime = function getTime(dateTime) {
        return dateTime.slice(11, 16)
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