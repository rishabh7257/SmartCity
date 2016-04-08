'use strict';
myLinkedIn.controller("EditSummaryCtrl", function($scope, $modalInstance,isEdit,$rootScope,DataService,$window) {
	
	
	console.log("M I in this!");
	console.log(isEdit);
	
	console.log(isEdit.mySummary);
	
	$scope.summary = isEdit;
	
	
	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };
	
	
	$scope.okay = function() {
			
			
			
			var params = {
					email : $rootScope.userId,
					
					summary : $scope.summary
			};
			
			DataService.putData(urlConstants.UPDATE_SUMMARY,params).success(function(response){
				$modalInstance.close(true);
			}).error(function(err){
				$modalInstance.dismiss(false);
			});
		
	};

	$scope.cancel = function() {
		$modalInstance.dismiss(false);
	};
});
