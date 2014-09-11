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
	
	app.controller('homeCtrl', [ "$scope", "Falcon", "FileApi", "XMLEntity", "$state", "X2jsService",  
	                             function($scope, Falcon, FileApi, XMLEntity, $state, X2jsService) {
		
		$scope.fileJson = {};
	
		$scope.handleFile = function (evt) {

			FileApi.loadFile(evt).then(function (data) {

				XMLEntity.json = X2jsService.xml_str2json( data.srcString );	 
	            XMLEntity.identifyEntityType();
	            
	            Falcon.postValidateEntity(data.srcString, XMLEntity.type).success(function (response) {
                    XMLEntity.valid = true;
                    $scope.fileJson.valid = true;
                    $scope.fileJson.serverMessage = response;
                    XMLEntity.response = response;
	            }).error(function (err) {   
	                var error = X2jsService.xml_str2json( err );            
                    XMLEntity.valid = false;                 
                    $scope.fileJson.valid = false;                                        
                    $scope.fileJson.serverMessage = error.result;
                    XMLEntity.response = error;
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
				$state.go('root.submitPreview'); 
			});
			     
		};		
       
	}]);	
	
	app.controller('submitPreviewCtrl', [ "$scope", "Falcon", "XMLEntity", "$state", "X2jsService", 
                                           function($scope, Falcon, XMLEntity, $state, X2jsService) {     

        $scope.cancelUpload = function () {
            console.info('upload cancelled');
        };
        $scope.confirmUpload = function () {
            
            var xmlToSend = X2jsService.json2xml_str(XMLEntity.json);
            
            Falcon.postSubmitEntity(xmlToSend, XMLEntity.type).success(function (data) {
                XMLEntity.serverMessage = data;
                $state.go('root.submited'); 
            }).error(function (err) {   
                $scope.$parent.fileJson.serverMessage = X2jsService.xml_str2json( err ).result;
                $scope.$parent.fileJson.valid = false;  
            });
        };
        
       
    }]);    
    
    app.controller('submitedCtrl', [ "$scope", "Falcon", "FileApi", "XMLEntity", "$state", "X2jsService",
                                     function($scope, Falcon, FileApi, XMLEntity, $state, X2jsService) {
        
        $scope.fileJson = {
            serverMessage : XMLEntity.serverMessage,
            type : XMLEntity.type,
            valid : XMLEntity.valid
        };   
        $scope.entitiesList = {};   
        Falcon.getEntities(XMLEntity.type).success(function (data) {
            $scope.entitiesList = data.entity;
        }).error(function (err) {
            console.log(err);
            
            
            $scope.fileJson.valid = false;  
        });
        
        
       
    }]);    
})();
