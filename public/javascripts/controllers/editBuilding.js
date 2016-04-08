'use strict';
wfms.controller("EditBuildingCtrl", function($scope, $modalInstance,
		 isEdit, $rootScope, DataService) {

	
	
	console.log("isEdit"+ isEdit);

	if (isEdit) {
		console.log(isEdit.start_date);
		$scope.buildingname = isEdit.buildingname;
		$scope.start_date = isEdit.start_date;
		$scope.release_date = isEdit.release_date;
		$scope.address = isEdit.address;
		$scope.checkpoint = isEdit.checkpoint;
		$scope.no_of_guards = isEdit.no_of_guards;
		
	} else {
		$scope.buildingname ="";
		$scope.start_date = "";
		$scope.release_date="";
		$scope.address = "";
		$scope.checkpoint = "";
		$scope.no_of_guards=""
	};
	
	
	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };
	  
	  


$scope.okay = function() {
	if($scope.buildingname &&
	$scope.start_date &&
	$scope.release_date &&
	$scope.address &&
	$scope.checkpoint &&
	$scope.no_of_guards){
	
		if (isEdit) {
			console.log(isEdit);

			var params = {
				
				
					//idclient : $rootScope.userId,
					idclient : 1,
					idbuilding:isEdit.idbuilding,
					start_date:$scope.start_date,
					release_date : $scope.release_date,
					buildingname:  $scope.buildingname,
					address : $scope.address,
					no_of_guards: $scope.no_of_guards,
					checkpoint : $scope.checkpoint
				
			};
			
			
			DataService.putData('/api/editBuilding', params)
			.success(function(response) {
				$modalInstance.close(true);
			}).error(function(err) {
				$modalInstance.close(false);
			});

}
		
		else {
			var params = {
					
					//idclient : $rootScope.userId,
					idclient : 1,
					start_date:$scope.start_date,
					release_date : $scope.release_date,
					buildingname:  $scope.buildingname,
					address : $scope.address,
					no_of_guards: $scope.no_of_guards,
					checkpoint : $scope.checkpoint
						
				};
			DataService.postData("/api/createBuilding",params).success(function(response){
				$modalInstance.close(true);
			}).error(function(err){
				$modalInstance.dismiss(false);
			});
		}
	}
	
	else{
		
		$scope.formError = "Form Invalid !!!";
	}

};

$scope.cancel = function() {
	$modalInstance.dismiss(false);
};


});





