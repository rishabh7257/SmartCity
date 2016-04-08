'use strict';
myLinkedIn.controller("ProfileController", function($scope, $rootScope, $modal,
		$location, DataService) {

	$scope.getAllData = function() {
		
		/*These functions will load the data of users when the page is loaded.
		 * 
		 */
		getUserDetails();
		getEmploymentList();
		getEducationList();
		getSkillsList();
		getSummary();
		
		
		/*
		 * This is to get the list of companies as a drop down when user is adding companies.
		 * Though other values can be added
		 */
		DataService.getData(urlConstants.GET_COMPANIES, []).success(
				function(response) {
					$scope.companies = response.data;
					console.log(response.data);
				}).error(function(err) {
			console.log("Error while fetching data");
		});
		
		/*
		 * This is to get the list of institutions as a drop down when user is adding education.
		 * Though other values can be added
		 */
		DataService.getData(urlConstants.GET_INSTITUTIONS, []).success(
				function(response) {
					$scope.institutions = response.data;
				}).error(function(err) {
			console.log("Error while fetching data");
		});
		
		
		
		
		
		/*
		 * This is to get the list of skills as a drop down when user is adding skills.
		 * Though other values can be added
		 */
		DataService.getData(urlConstants.GET_SKILLS, []).success(
				function(response) {
					$scope.skills = response.data;
				}).error(function(err) {
			console.log("Error while fetching data");
		});
	}
	
	
	/*
	 * Adding editing or deleting the profile of the user
	 */
	$scope.modifyProfile = function() {

		var editProfileModal = $modal.open({
			templateUrl : 'templates/editProfile.html',
			controller : 'EditProfileCtrl',
			size : 'lg',
			resolve : {
				isEdit : function(){
					return $scope.myProperties;
				}
			}
		});

		editProfileModal.result.then(function(isValid) {
			if(isValid){
				getUserDetails();
			}
		}, function() {
		});
	};
	
	
	
	/*
	 * Modifying summary of the user	
	 */
	
	$scope.modifySummary = function() {

		var editProfileModal = $modal.open({
			templateUrl : 'templates/editSummary.html',
			controller : 'EditSummaryCtrl',
			size : 'lg',
			resolve : {
				isEdit : function(){
					return $scope.mySummary;
				}
			}
		});

		editProfileModal.result.then(function(isValid) {
			if(isValid){
				getSummary();
			}
		}, function() {
		});
	};
	

	/*
	 * Adding editing or deleting the employment of the user
	 */
	$scope.modifyEmployment = function(data) {

		var modalInstance = $modal.open({
			templateUrl : 'templates/editEmployment.html',
			controller : 'EditEmploymentCtrl',
			size : 'lg',
			resolve : {
				companies : function() {
								return $scope.companies;
							},
				isEdit : function(){
					return data;
				}
			}
		});

		modalInstance.result.then(function(isValid) {
			if (isValid) {
				getEmploymentList();
			}
		}, function() {
		});
	};
	

	

	
	/*
	 * Adding editing or deleting the education of the user
	 */
	$scope.modifyEducation = function(data) {

		var educationInstance = $modal.open({
			templateUrl : 'templates/editEducation.html',
			controller : 'EditEducationCtrl',
			size : 'lg',
			resolve : {
				institutions : function() {
					return $scope.institutions;
				},
				isEdit : function(){
					return data;
				}
			}
		});

		educationInstance.result.then(function(isValid) {
			if (isValid) {
				getEducationList();
			}
		}, function() {
		});
	};
	
	
	/*
	 * Adding editing or deleting the skills of the user
	 */
	
	$scope.modifySkills = function() {

		var skillsInstance = $modal.open({
			templateUrl : 'templates/editSkills.html',
			controller : 'EditSkillsCtrl',
			size : 'lg',
			resolve : {
				skills : function() {
					return $scope.skills;
				}
			}
		});

		skillsInstance.result.then(function(isValid) {
			if (isValid) {
				getSkillsList();
			}
		}, function() {
		});
	};
	
	
	/*
	 * Getting the profile data of the specific user
	 */
	function getUserDetails(){
		
		var uri = urlConstants.GET_USER_DETAILS+$rootScope.userId;
		DataService.getData(uri,[]).success(function(response){
			$scope.myProperties = response.data[0];
		}).error(function(err){
			console.log(err.message);
		});
	}
	
	/*
	 * Getting the summary data of the specific user
	 */
	function getSummary() {
		var uriSummary = urlConstants.GET_SUMMARY
				+ $rootScope.userId;
		
		DataService.getData(uriSummary, []).success(function(response) {
			$scope.mySummary = response.data[0].summary;
			console.log(response.data[0].summary);
			//console.log("Summary:"+data.mySummary);
		}).error(function(err) {
			console.log(err);
		});
	}

	
	
	
	/*
	 * Getting the employment data of the specific user
	 */
	function getEmploymentList() {
		var uriEmployment = urlConstants.GET_EMPLOYMENT_DETAILS
				+ $rootScope.userId;

		DataService.getData(uriEmployment, []).success(function(response) {
			$scope.employmentData = response.data;
		}).error(function(err) {
			console.log(err);
		});
	}
	
	/*
	 * Getting the education data of the specific user
	 */
	function getEducationList() {
		var uriEducation = urlConstants.GET_EDUCATION_DETAILS
				+ $rootScope.userId;
		DataService.getData(uriEducation, []).success(function(response) {
			$scope.educationData = response.data;
		}).error(function(err) {
			console.log(err);
		});
	}
	
	/*
	 * Getting the skill data of the specific user
	 */
	function getSkillsList() {
		var uriSkills = urlConstants.GET_SKILLS_DETAILS + $rootScope.userId;
		DataService.getData(uriSkills, []).success(function(response) {
			$scope.skillsData = response.data;
		}).error(function(err) {
			console.log(err);
		});
	}

});