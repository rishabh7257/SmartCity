'use strict';
wfms.controller("ClientDashboard", function($scope, $rootScope, $modal,
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

        var dp = new dataProcessor("/data");
        dp.init(scheduler);
        dp.setTransactionMode("POST", false);
    }
    	$scope.addPoints = function () {
        var seriesArray = $scope.chart2.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chart2.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chart2.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.options = {
        type: 'line'
    }


    $scope.swapChartType = function () {
        if (this.chart2.options.chart.type === 'line') {
            this.chart2.options.chart.type = 'bar'
        } else {
            this.chart2.options.chart.type = 'line'
        }
    }

   
    $scope.clientPowerStatus = function(){
		//alert("Power controller called");
		DataService.getData("/api/t",[]).success(function(response){
			//alert("User Type" + $rootScope.userType);
		//c	alert("Data is"+response.data.length);
			for (var i = 0; i < response.data.length; i++) {
				if(($rootScope.userType=="Hospital" && response.data[i].thresholdLevel >1) ||
						($rootScope.userType=="Commercial" && response.data[i].thresholdLevel >5) ||
						($rootScope.userType=="Residential" && response.data[i].thresholdLevel >10))
						{
					$scope.powerStatus ="Red";
				}
				else {
					$scope.powerStatus ="Green";
				}
			}
			//$scope.powerStatus = response.data;
		}).error(function(err){
			console.log(err.message);
		});
		//$scope.clientPowerStatus = response.data[0];
		
	}
	
	function clientInfo(){
		
		//var uri = urlConstants.GET_USER_DETAILS+$rootScope.userId;
		DataService.getData("/api/getClientInfo/7",[]).success(function(response){
			
			console.log("Response" + response.data[0]);
			$scope.clientProperties = response.data[0];
			$rootScope.userId = response.data[0].email;
			$rootScope.userName = response.data[0].name;
			$rootScope.userLastLogin = response.data[0].lastLogin;
			$rootScope.city = response.data[0].city;
			console.log("City: " + $rootScope.city);
		}).error(function(err){
			console.log(err.message);
		});
	}
	
	function getFutureData() {
		DataService.postData("/api/getfutureWeather",[]).success(function(response){
			
			console.log(response.data[0]);
			
		}).error(function(err){
			console.log(err.message);
		});
	}
	
	$scope.modifyClientInfo = function(data) {
		console.log("did i get called");

		var modalInstance = $modal.open({
			templateUrl : 'templates/client/editClientInformation.html',
			controller : 'EditBuildingCtrl',
			size : 'lg',
			resolve : {
				isEdit : function(){
					return data;
				}
		
			}
		});

		modalInstance.result.then(function(isValid) {
			if (isValid) {
				getBuilding();
			}
		}, function() {
		});
	};
	

		
		
	
	$scope.getWeatherData = function () { // On DOM ready...

	        var place = 'United_States/California/San_Francisco';
	        location.hash = 'https://www.yr.no/place/' + place + '/forecast_hour_by_hour.xml';

	    $.getJSON(
	        'https://www.highcharts.com/samples/data/jsonp.php?url=' + location.hash.substr(1) + '&callback=?',
	        function (xml) {
	            window.meteogram = new Meteogram(xml, 'container');
	        }
	    );

	};
	
});
	

	