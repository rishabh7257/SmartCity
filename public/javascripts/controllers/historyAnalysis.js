'use strict';
wfms.controller( "HistoryAnalysis", function( $scope, $rootScope, $modal, $location, DataService ) {
    $rootScope.userType = "Hospital";
    $scope.getData = function() {
        clientInfo();
        getFutureData();
    };
    $scope.outagesByArea = function() {
        DataService.getData( "/api/getOutagesByArea", [] ).success( function( response ) {
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
                series: [ {
                    name: "Outages By Area",
                    colorByPoint: true,
                    data: [ {
                        name: response.Area[ 0 ],
                        y: response.Count[ 0 ]
                    }, {
                        name: response.Area[ 1 ],
                        y: response.Count[ 1 ]
                    }, {
                        name: response.Area[ 2 ],
                        y: response.Count[ 2 ]
                    }, {
                        name: response.Area[ 3 ],
                        y: response.Count[ 3 ]
                    } ],
                    loading: false
                } ]
            }
        } ).error( function( err ) {
            console.log( err.message );
        } );
    }
    $scope.outagesByCause = function() {
        DataService.getData( "/api/getOutagesByCause", [] ).success( function( response ) {
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
                series: [ {
                    name: "Outages By Cause",
                    colorByPoint: true,
                    data: [ {
                        name: response.Cause[ 0 ],
                        y: response.Count[ 0 ]
                    }, {
                        name: response.Cause[ 1 ],
                        y: response.Count[ 1 ]
                    }, {
                        name: response.Cause[ 2 ],
                        y: response.Count[ 2 ]
                    }, {
                        name: response.Cause[ 3 ],
                        y: response.Count[ 3 ]
                    }, {
                        name: response.Cause[ 4 ],
                        y: response.Count[ 4 ]
                    }, {
                        name: response.Cause[ 5 ],
                        y: response.Count[ 5 ]
                    }, {
                        name: response.Cause[ 6 ],
                        y: response.Count[ 6 ]
                    }, {
                        name: response.Cause[ 7 ],
                        y: response.Count[ 7 ]
                    } ],
                    loading: false
                } ]
            }
        } ).error( function( err ) {
            console.log( err.message );
        } );
    }
    $scope.getOutageData = function() {
        DataService.getData( "/api/getPowerOutage", [] ).success( function( response ) {
            $scope.xAxis = response.x;
            $scope.yAxis = response.y;
            $scope.chart2 = {
                options: {
                    chart: {
                        type: 'bar'
                    }
                },
                xAxis: {
                    type: String,
                    categories: $scope.xAxis
                },
                yAxis: {
                    title: {
                        text: 'Causes'
                    }
                },
                series: [ {
                    data: $scope.yAxis
                } ],
                loading: false
            }
        } ).error( function( err ) {
            console.log( err.message );
        } );
    }
} );
