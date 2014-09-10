(function () {
	
	var app = angular.module('app.controllers', ['app.services']);
	
	app.controller('headerCtrl', ["$scope", "Falcon", "$filter", function($scope, Falcon, $filter) {
		$scope.adminResource = {};		

	    Falcon.getServerVersion().success(function (data) {
		        $scope.adminResource.version = data.properties[0].value;
		        $scope.adminResource.mode = data.properties[1].value;		        
		    }).error(function (err) {
		        console.log(err);
		    });
	  
	}]);
	
	app.controller('homeCtrl', [
								"$scope", "Falcon", "FileApi", 
								"XMLEntity", "$state", "X2jsService", 
								"$rootScope", function($scope, Falcon, FileApi, XMLEntity, $state, X2jsService, $rootScope) {
		
		$scope.fileJson = {};
	
		$scope.handleFile = function (evt) {

			FileApi.loadFile(evt).then(function (data) {

				XMLEntity.json = X2jsService.xml_str2json( data.srcString );	 
	            XMLEntity.identifyEntityType();
	            Falcon.postValidateEntity(data.srcString, XMLEntity.type).success(function (data) {
	            	console.log(data);
	            	XMLEntity.valid = true;
	            	$scope.fileJson.valid = true;
	            }).error(function (err) {
	            	console.log(err);
	            	XMLEntity.valid = false;
	            	$scope.fileJson.valid = false;
	            });   
	            
	            $scope.fileJson = {
					name : data.fileDetails.name,
					type : data.fileDetails.type || 'n/a',
					modDate : data.fileDetails.lastModifiedDate ? data.fileDetails.lastModifiedDate.toLocaleDateString() : 'n/a',
					size : data.fileDetails.size,
					content : data.srcString,
					entityType: XMLEntity.type
	            };

			}).then( function() { 
				$state.go('root.upload'); 
			});
			     
		};
		$scope.cancelUpload = function () {
			console.info('upload cancelled');
			$scope.fileJson = {};
		};
		$scope.confirmUpload = function () {
			
			var xmlToSend = X2jsService.json2xml_str(XMLEntity.json);
			
			Falcon.postValidateEntity(xmlToSend, XMLEntity.type).success(function (data) {
				console.log(data);
			}).error(function (err) {
				console.log(err);
			});
		};
		
       
	}]);	
})();
