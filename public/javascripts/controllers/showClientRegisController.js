'use strict';
wfms.controller("ShowClientRegisController", function($scope, $rootScope, $modal, $location, DataService, $window) {
    $scope.registerClient = function() {
        console.log("inside register Client");
        var modalInstance = $modal.open({
            templateUrl: 'templates/index/register.html',
            controller: 'ClientRegistrationController',
            size: 'lg',
        });
        modalInstance.result.then(function(isValid) {
            if (isValid) {
                getData();
            }
        }, function() {});
    };
    $scope.loginClient = function() {
        console.log("Inside login client Funct");
        if ($scope.email === "" || $scope.password === "") {
            $scope.formError = "Form Invalid !!!";
        } else {
            var params = {
                email: $scope.email,
                password: $scope.password
            };
            DataService.postData("/api/login", params).success(function(response) {
                console.log("Login Successful");
                $rootScope.idclient = response.idclient;
                $rootScope.idperson = response.idperson;
                $rootScope.fname = response.fname;
                $rootScope.lname = response.lname;
                $rootScope.email = response.email;
                $rootScope.lastLogin = response.lastLogin;
                

                $window.sessionStorage.type = response.type;
                console.log("Session Type" + $window.sessionStorage.type);
                console.log("Data " + response.type);
                $window.sessionStorage.idclient = response.idclient;
                $window.sessionStorage.idperson = response.idperson;
                $window.sessionStorage.fname = response.fname;
                $window.sessionStorage.lname = response.lname;
                $window.sessionStorage.email = response.email;
                $window.sessionStorage.lastLogin = response.lastLogin;
                $window.sessionStorage.city = response.city;
                $window.sessionStorage.state = response.state;
                $window.sessionStorage.country = response.country;
                $window.sessionStorage.postal = response.zipcode;

                console.log("city: " + $window.sessionStorage.city);
                console.log("state: " + $window.sessionStorage.state);
                $rootScope.type = $window.sessionStorage.type;
                $rootScope.lastLogin = $window.sessionStorage.lastLogin;
                $rootScope.idclient = $window.sessionStorage.idclient;
                $rootScope.idperson = $window.sessionStorage.idperson;
                $rootScope.fname = $window.sessionStorage.fname;
                $rootScope.fname = $window.sessionStorage.fname;
                $rootScope.email = $window.sessionStorage.email;
                $rootScope.postal = response.zipcode;
                $rootScope.city = response.city;
                $rootScope.state = response.state;
                console.log("idperson:" + $rootScope.idperson);
                console.log("zipcode:" + $rootScope.postal);
                $location.path('/client');
            }).error(function(err) {
                console.log("Error while fetching data");
            });
        }
    };
});