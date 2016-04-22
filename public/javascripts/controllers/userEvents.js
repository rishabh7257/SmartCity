'use strict';
wfms.controller("UserEvents", function($scope, $rootScope, $modal,
                                            $location, DataService) {

    $rootScope.userType = "Hospital";

    $scope.getData = function() {

        clientInfo();
        getFutureData();

    };

    $scope.initCal = function() {
        scheduler.init('scheduler_here',new Date(2016,3,16),"month");

        scheduler.templates.xml_date = function(value){ return new Date(value); };
        scheduler.load("/data", "json");
       // console.log("Used id is "+req.session.idperson);
        var dp = new dataProcessor("/data");
        dp.init(scheduler);
        dp.setTransactionMode("POST", false);
    }


});
	

	