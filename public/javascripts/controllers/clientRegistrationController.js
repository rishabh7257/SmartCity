'use strict';
wfms.controller("ClientRegistrationController", function($scope, $modalInstance,$rootScope,DataService,$window) {

	console.log("M I in this!");
	
	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

$scope.register = function() {

	console.log("Inside register Funct");
	if($scope.firstname === "" || $scope.lastname === "" || $scope.address === "" || $scope.city === "" || $scope.zipcode=== "" || $scope.email=== "" ||  $scope.number === "" ||  $scope.password === ""){
		$scope.formError = "Form Invalid !!!";
	}else{
		
		var params = {
				
				fname : $scope.firstname,
				lname:  $scope.lastname,
				address : $scope.address,
				city : $scope.city,
				zipcode : $scope.zipcode,
				email : $scope.email,
				phonenumber : $scope.number,
				password : $scope.password,
				usertype: "CLNT"
					
			};
		DataService.postData("/api/register",params).success(function(response){
			$modalInstance.close(true);
		}).error(function(err){
			$modalInstance.dismiss(false);
		});
	}
};

$scope.cancel = function() {
	$modalInstance.dismiss(false);
};
});

