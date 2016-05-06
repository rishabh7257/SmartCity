'use strict';
wfms.controller("UserEvents", function($scope, $rootScope, $modal, $location, DataService, EventService, $window) {
    $scope.getData = function() {
        $scope.initCal();
        $scope.configureDynamicView($rootScope.postal);
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
            $scope.eventsCloseToUserEvents();
        }).error(function(err) {
            console.log(err.message);
        });
    }
    $scope.initCal = function() {
        scheduler.init('scheduler_here', new Date(2016, 4, 16), "month");
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
        $scope.pooja = "hello";
        var headCount =[];
        DataService.getData(url, []).success(function(response) {
            var value = [];
            var element ;
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
                                if(!($scope.allEvents[j].predictedHeadCount == 0)){
                                   // var v= m + ":" + d + ":" + y + " at " + $scope.allEvents[j].name;
                                    var v = m + ":" + d + ":" + y;
                                    element = {hc: $scope.allEvents[j].predictedHeadCount, sd: v };
                                    value.push(element);
                                }
                                $scope.e = value;

                            }
                        }
                    }
                }

            }
        }).error(function(err) {
            console.log(err.message);
        });
    }
});