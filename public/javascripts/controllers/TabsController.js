(function(){

    var wfms = angular.module("routedTabs", ["ui.router", "ui.bootstrap"]);

    wfms.config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise("/template/client/tab1");

        $stateProvider
            .state("main", { abtract: true, url:"/template/client", templateUrl:"historyAnalysis.html" })
            .state("main.tab1", { url: "/template/client/tab1", templateUrl: "tab1.html" })
            .state("main.tab2", { url: "/template/client/tab2", templateUrl: "tab2.html" })
            .state("main.tab3", { url: "/template/client/tab3", templateUrl: "tab3.html" });

    });

    wfms.controller("mainController", function($rootScope, $scope, $state) {

        $scope.go = function(route){
            $state.go(route);
        };

        $scope.active = function(route){
            return $state.is(route);
        };

        $scope.tabs = [
            { heading: "Tab 1", route:"main.tab1", active:false },
            { heading: "Tab 2", route:"main.tab2", active:false },
            { heading: "Tab 3", route:"main.tab3", active:false },
        ];

        $scope.$on("$stateChangeSuccess", function() {
            $scope.tabs.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        });
    });

}());

/* 'use strict';
wfms.controller("tabsController", function($scope, $rootScope, $modal, $location, DataService) {

        // For any unmatched url, send to /route1
       // $urlRouterProvider.otherwise("/route1")
        alert(" Inside myapp");*/
     /*   $stateProvider
            .state('route1', {
                url: "/route1",
                templateUrl: "route1.html"
            })
            .state('route1.list', {
                url: "/list",
                templateUrl: "templates/client/"+chart1 + ".html",
                controller: function ($scope) {
                    $scope.items = ["A", "List", "Of", "Items"];
                }
            })

            .state('route2', {
                url: "/route2",
                templateUrl: "templates/client/"+chart1 + ".html"
            })
            .state('route2.list', {
                url: "/list",
                templateUrl: "templates/client/"+chart2 + ".html",
                controller: function ($scope) {
                    $scope.things = ["A", "Set", "Of", "Things"];
                }
            })*/
   /* });*/

