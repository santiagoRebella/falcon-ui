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
	
	app.controller('homeCtrl', ["$scope", "Falcon", "XMLEntity", "$state", "X2jsService", function($scope, Falcon, XMLEntity, $state, X2jsService) {
		
		$scope.fileJson = {};
	
		$scope.handleFile = function (evt) {
			
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				
			    var reader = new FileReader(), 
					file = evt.target.files[0];
				
		        reader.onload = (function(theFile) {
	
					reader.readAsText(theFile, "UTF-8");

			        return function(e) {
			        	console.log(e.target);
						console.log(e.target.result);
						console.log(typeof e.target.result);
			            //XMLEntity.json = X2jsService.xml_str2json( e.target.result );	
			            XMLEntity.json = X2jsService.xml_str2json( e.target.result );	 
			            XMLEntity.file = X2jsService.json2xml( XMLEntity.json );	 
			            console.log(e.target.result);
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
			console.info('upload cancelled');
			$scope.fileJson = {};
		};
		$scope.confirmUpload = function () {
			console.log(XMLEntity.file);
			
			var xmlToSend = X2jsService.json2xml(XMLEntity.json);
			console.log(xmlToSend);
			
			Falcon.postValidateEntity(xmlToSend, XMLEntity.type).success(function (data) {
				console.log(data);
			}).error(function (err) {
				console.log('TTTTTTTTTTTTTTTTTTT');
				console.log(err);
			});
		};
		
       
	}]);	
})();
