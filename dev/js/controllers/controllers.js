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
	
	app.controller('homeCtrl', ["$scope", "Falcon", "XMLEntity", "$state", function($scope, Falcon, XMLEntity, $state) {
		
		$scope.fileJson = {};
	
		$scope.handleFile = function (evt) {
			
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				
			    var reader = new FileReader(), 
					file = evt.target.files[0];
				
		        reader.onload = (function(theFile) {
	
					reader.readAsText(theFile, "UTF-8");

			        return function(e) {

			            XMLEntity.json = XMLEntity.xml_str2json( e.target.result );	  
			            XMLEntity.identifyEntityType();
			            XMLEntity.validateEntity();
			            
			            $scope.fileJson = {
							name : file.name,
							type : file.type || 'n/a',
							modDate : file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
							size : file.size,
							content : e.target.result,
							valid: XMLEntity.valid,
							entityType: XMLEntity.type
			            };

						$scope.$apply();   
						$state.go('root.upload'); 
					
			        };
			        
			    })(file);

	
			} else {
			    alert('The File APIs are not fully supported in this browser.');
			}    
		};
		$scope.cancelUpload = function () {
			alert('cancel');
		};
		$scope.confirmUpload = function () {

		};
		
       
	}]);	
})();
