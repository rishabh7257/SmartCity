'use strict';
wfms.controller("ClientDashboard", function($scope, $rootScope, $modal,
		$location, DataService) {

	$rootScope.userType = "Hospital";
	
	$scope.getData = function() {
		
		clientInfo();
		getFutureData();
		
	};
	
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
    
    $scope.chart1={
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
    $scope.chart2 = {
        options: { 
            chart: {
                type: 'bar'
            }
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }],
        title: {
            text: 'Hello'
        },
        loading: false
    }

    
    $scope.getOutageBarChart = {
            options: { 
                chart: {
                    type: 'bar'
                }
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }],
            title: {
                text: 'Hello'
            },
            loading: false
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
			
			//angular.toJson(response);
			//console.log(response.data[0]);
			$scope.clientProperties = response.data[0];
			
		}).error(function(err){
			console.log(err.message);
		});
	}
	
	function getFutureData() {
		DataService.postData("/api/getfutureWeather",[]).success(function(response){
			
			//angular.toJson(response);
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

	    // Set the hash to the yr.no URL we want to parse
	    alert("Inside WeatherData");
	       // var place = 'United_Kingdom/England/London';
	        //place = 'France/Rh�ne-Alpes/Val_d\'Is�re~2971074';
	        //place = 'Norway/Sogn_og_Fjordane/Vik/M�lset';
	        var place = 'United_States/California/San_Francisco';
	        //place = 'United_States/Minnesota/Minneapolis';
	        location.hash = 'https://www.yr.no/place/' + place + '/forecast_hour_by_hour.xml';

	    

	    // Then get the XML file through Highcharts' jsonp provider, see
	    // https://github.com/highcharts/highcharts/blob/master/samples/data/jsonp.php
	    // for source code.
	    $.getJSON(
	        'https://www.highcharts.com/samples/data/jsonp.php?url=' + location.hash.substr(1) + '&callback=?',
	        function (xml) {
	            window.meteogram = new Meteogram(xml, 'container');
	        }
	    );

	};
	
});
	

	