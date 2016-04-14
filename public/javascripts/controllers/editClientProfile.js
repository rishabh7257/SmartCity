'use strict';
wfms.controller("EditClientProfileCtrl", function($scope, $http, $modalInstance,

		isEdit, $rootScope, DataService, $window) {
	
	
	
	$scope.states= [
	                  { name: 'ALABAMA', abbreviation: 'AL'},
	                  { name: 'ALASKA', abbreviation: 'AK'},
	                  { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
	                  { name: 'ARIZONA', abbreviation: 'AZ'},
	                  { name: 'ARKANSAS', abbreviation: 'AR'},
	                  { name: 'CALIFORNIA', abbreviation: 'CA'},
	                  { name: 'COLORADO', abbreviation: 'CO'},
	                  { name: 'CONNECTICUT', abbreviation: 'CT'},
	                  { name: 'DELAWARE', abbreviation: 'DE'},
	                  { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
	                  { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
	                  { name: 'FLORIDA', abbreviation: 'FL'},
	                  { name: 'GEORGIA', abbreviation: 'GA'},
	                  { name: 'GUAM', abbreviation: 'GU'},
	                  { name: 'HAWAII', abbreviation: 'HI'},
	                  { name: 'IDAHO', abbreviation: 'ID'},
	                  { name: 'ILLINOIS', abbreviation: 'IL'},
	                  { name: 'INDIANA', abbreviation: 'IN'},
	                  { name: 'IOWA', abbreviation: 'IA'},
	                  { name: 'KANSAS', abbreviation: 'KS'},
	                  { name: 'KENTUCKY', abbreviation: 'KY'},
	                  { name: 'LOUISIANA', abbreviation: 'LA'},
	                  { name: 'MAINE', abbreviation: 'ME'},
	                  { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
	                  { name: 'MARYLAND', abbreviation: 'MD'},
	                  { name: 'MASSACHUSETTS', abbreviation: 'MA'},
	                  { name: 'MICHIGAN', abbreviation: 'MI'},
	                  { name: 'MINNESOTA', abbreviation: 'MN'},
	                  { name: 'MISSISSIPPI', abbreviation: 'MS'},
	                  { name: 'MISSOURI', abbreviation: 'MO'},
	                  { name: 'MONTANA', abbreviation: 'MT'},
	                  { name: 'NEBRASKA', abbreviation: 'NE'},
	                  { name: 'NEVADA', abbreviation: 'NV'},
	                  { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
	                  { name: 'NEW JERSEY', abbreviation: 'NJ'},
	                  { name: 'NEW MEXICO', abbreviation: 'NM'},
	                  { name: 'NEW YORK', abbreviation: 'NY'},
	                  { name: 'NORTH CAROLINA', abbreviation: 'NC'},
	                  { name: 'NORTH DAKOTA', abbreviation: 'ND'},
	                  { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
	                  { name: 'OHIO', abbreviation: 'OH'},
	                  { name: 'OKLAHOMA', abbreviation: 'OK'},
	                  { name: 'OREGON', abbreviation: 'OR'},
	                  { name: 'PALAU', abbreviation: 'PW'},
	                  { name: 'PENNSYLVANIA', abbreviation: 'PA'},
	                  { name: 'PUERTO RICO', abbreviation: 'PR'},
	                  { name: 'RHODE ISLAND', abbreviation: 'RI'},
	                  { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
	                  { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
	                  { name: 'TENNESSEE', abbreviation: 'TN'},
	                  { name: 'TEXAS', abbreviation: 'TX'},
	                  { name: 'UTAH', abbreviation: 'UT'},
	                  { name: 'VERMONT', abbreviation: 'VT'},
	                  { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
	                  { name: 'VIRGINIA', abbreviation: 'VA'},
	                  { name: 'WASHINGTON', abbreviation: 'WA'},
	                  { name: 'WEST VIRGINIA', abbreviation: 'WV'},
	                  { name: 'WISCONSIN', abbreviation: 'WI'},
	                  { name: 'WYOMING', abbreviation: 'WY' }
	              ];
	
	
	//ZipCode Validation
	function isValidPostalCode(postalCode) {
        var postalCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;
        return postalCodeRegex.test(postalCode);
}

	//SSN Validation
	function isSSN(ssn) {
        var ssnRegex =  /^(?!000)(?!666)(?!9)\d{3}[- ]?(?!00)\d{2}[- ]?(?!0000)\d{4}$/;
        return ssnRegex.test(ssn);
}

//date validation
	
	  function compareDate(first,second) {
	      if(first>second){return false;}
	      else{return true;}
	}
	  
	  function isValidPhone(phone)
	  {	if(phone>0)
	  	{
	  	var phoneRegex = /^\d{10}$/;
	  	return phoneRegex.test(phone);
	  	}
	  	return false;
	  }
	  
	  function isValidateEmail(email) {
		    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		    return re.test(email);
		}

	
  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocation = function(val) {
    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return {
          location: item.geometry.location,
          formatted_address: item.formatted_address
        }
      });
    });
  };


	console.log("isEdit" + isEdit);

	console.log(isEdit.fname);
	$scope.firstName = isEdit.fname;
	$scope.lastName = isEdit.lname;
	$scope.email = isEdit.email;
	$scope.phonenumber = isEdit.phonenumber;
	$scope.address = isEdit.address;
	$scope.city = isEdit.city;
	$scope.state = isEdit.state;
	$scope.ZipCode = isEdit.zipcode;
	$scope.start_date = isEdit.start_date;
	$scope.end_date = isEdit.end_date;

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	$scope.okay = function() {
		
		if(!(isValidPostalCode($scope.ZipCode))){
			$scope.formError = "Enter a valid ZipCode";
			
		}
		else if(!(isValidateEmail($scope.email)))
		   {
		   $scope.formError = "Invalid Email-Id!!!";
		   }
		
		else if(!(isValidPhone($scope.phonenumber)))
		   {
		   $scope.formError = "Invalid phonenumber !!!";
		   }
		else{
		if ($scope.firstName && $scope.lastName && $scope.email
				&& $scope.phonenumber && $scope.address && $scope.city
				&& $scope.ZipCode) {

			var paramsPerson = {
				idperson : $window.sessionStorage.idperson,
				fname : $scope.firstName,
				lname : $scope.lastName,
				address : $scope.address,
				city : $scope.city,
				state : $scope.state,
				zipcode : $scope.ZipCode,
				email : $scope.email,
				phonenumber : $scope.phonenumber,
				//idperson : $scope.idperson
			};
			DataService.putData("/api/editPerson", paramsPerson).success(
					function(response) {
						console.log("Editted Successfully");

						var params = {
							//	idperson : 7,
							idperson : $window.sessionStorage.idperson,
							start_date : $scope.start_date,
							end_date : $scope.end_date
						};
						//DataService.putData('/api/editClient', params)
						//.success(
					DataService.putData('api/updateClient', params)
								.success(function(response) {

									$modalInstance.close(true);
								}).error(function(err) {
									$modalInstance.close(false);
								});

					}).error(function(err) {
				console.log("Error while fetching data");

			});

//		DataService.putData('/api/editClient', params).success(
//					function(response) {
//						$modalInstance.close(true);
//					}).error(function(err) {
//				$modalInstance.close(false);
//			});

		}

		else {

			$scope.formError = "Form Invalid !!!";
		}

	};
	}

	$scope.cancel = function() {
		$modalInstance.dismiss(false);
	};


});