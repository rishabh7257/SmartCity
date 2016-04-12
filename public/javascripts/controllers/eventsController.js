'use strict';
wfms.controller("eventsController", function($scope, $rootScope, $modal,
		$location, DataService) {


	$scope.getData = function() {

		$scope.configureDynamicView();
		//extractEvent();

	};

	$scope.configureDynamicView = function configureDynamicView() {

		var url = "/api/getEventsByPostal/" + $rootScope.postal
		//var url = "/api/getEventsByPostal/95126"
		DataService.getData(url ,[]).success(function(response){
			//$scope.events = response;
			$scope.extractEvent(response);
			console.log("Got the Data");
		}).error(function(err){
			console.log(err.message);
		});

	}

	$scope.extractEvent = function extractEvent(data) {

		var events = data.data.search.events.event;
		console.log(events);
		var tableRow = events.length;
		var eventArray = [];
		for (var i = 0 ; i < tableRow ; i++) {
			var eachEvent = {
				'date' : $scope.getDate(events[i].start_time),
				'time' : $scope.getTime(events[i].start_time),
				'address' : events[i].venue_address,
				'city' : events[i].city_name,
				'name' : events[i].venue_name,
				'predictedHeadCount' :$scope.getPredictedHeadCount(events[i].price)

			}
			eventArray.push(eachEvent);
		}

		$scope.allEvents = eventArray
		console.log(JSON.stringify($scope.allEvents));

	}

	$scope.getPredictedHeadCount = function getPredictedHeadCount(price) {

		if (price) {
			var predictedHeadCount = "";
			if (price[0] == '$') {
				price = price.slice(1)
			}
			for (var i = 0; i<price.length; i++) {
			    if (price[i] == " ") {
			    	console.log(predictedHeadCount);
			        return((parseInt(predictedHeadCount) * 100)/10);
			       } else {
			           predictedHeadCount = predictedHeadCount + price[i];
			       }
			   }

		} else {
			return 0;
		}
	}

	$scope.getDate = function getDate(dateTime) {
		return dateTime.slice(0,10)

	}

//		return $filter('date')(dateTime,'dd/MM/yyyy')

	$scope.getTime = function getTime(dateTime) {
		return dateTime.slice(11,16)
	}

	

    $scope.removeRow = function removeRow(row) {
        var index = scope.rowCollection.indexOf(row);
        if (index !== -1) {
            scope.rowCollection.splice(index, 1);
        }
    }

});
