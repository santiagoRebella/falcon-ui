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
                XMLEntity.showServerMessage = true;      
                $state.go('root.dashboard'); 
            }).error(function (err) {   
                $scope.$parent.fileJson.serverMessage = X2jsService.xml_str2json( err ).result;
                $scope.$parent.fileJson.valid = false;  
            });
        };
        
       
    }]);    
    
    app.controller('dashboardCtrl', [ "$scope", "Falcon", "FileApi", "XMLEntity", "$state", "X2jsService",
                                     function($scope, Falcon, FileApi, XMLEntity, $state, X2jsService) {
        
        $scope.showServerMessage = (function() { return XMLEntity.showServerMessage; })();
        
        if($scope.showServerMessage === true) {
            $scope.fileJson = {
                serverMessage : XMLEntity.serverMessage,
                type : XMLEntity.type,
                valid : XMLEntity.valid
            };   
        }
        $scope.lists = {};
        $scope.lists.feedList = [];
        $scope.lists.clusterList = [];
        $scope.lists.processList = []; 
        
        function refreshLists() {
            $scope.lists.feedList = [];
            $scope.lists.clusterList = [];
            $scope.lists.processList = []; 
            Falcon.getEntities("feed")
                .success(function (data) { 
                    var typeOfData = Object.prototype.toString.call(data.entity);        
                    if(data === "null") { $scope.lists.feedList = []; }
                    else if(typeOfData === "[object Array]") { $scope.lists.feedList = data.entity; }
                    else if(typeOfData === "[object Object]") { $scope.lists.feedList[0] = data.entity; } 
                    else { console.log("type of data not recognized"); }
                    
                 })
                .error(function (err) { console.log( err ); });
            
            Falcon.getEntities("cluster")
                .success(function (data) { 
                    var typeOfData = Object.prototype.toString.call(data.entity);        
                    if(data === "null") { $scope.lists.clusterList = []; }
                    else if(typeOfData === "[object Array]") { $scope.lists.clusterList = data.entity; }
                    else if(typeOfData === "[object Object]") { $scope.lists.clusterList[0] = data.entity; } 
                    else { console.log("type of data not recognized"); }
                 })
                .error(function (err) { console.log( err ); });
                
            Falcon.getEntities("process")
                .success(function (data) { 
                    var typeOfData = Object.prototype.toString.call(data.entity);        
                    if(data === "null") { $scope.lists.processList = []; }
                    else if(typeOfData === "[object Array]") { $scope.lists.processList = data.entity; }
                    else if(typeOfData === "[object Object]") { $scope.lists.processList[0] = data.entity; } 
                    else { console.log("type of data not recognized"); }
                 })
                .error(function (err) { console.log( err ); });            
        }
        refreshLists();          
 
        $scope.deleteEntity = function (type, name) {         
            Falcon.deleteEntity(type, name)
                .success(function (data) { console.log( data ); refreshLists(); })
                .error(function (err) { console.log( err ); });  
        };
        $scope.cloneEntity = function (type, name) {         
            console.log("clone " + type + " - " + name);
        };
        $scope.editEntity = function (type, name) {         
            console.log("edit " + type + " - " + name);
        };
        $scope.relationsEntity = function (type, name) {         
            console.log("relations " + type + " - " + name);
        };
        
       
    }]);  
    
    app.controller('formCtrl', [ "$scope", "Falcon", "XMLEntity", "$state", "X2jsService", 
                                           function($scope, Falcon, XMLEntity, $state, X2jsService) {     

        $scope.entity = {};
        
        
       
    }]);    
    
      
})();
