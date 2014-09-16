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
	
	app.controller('rootCtrl', [ "$scope", "$timeout", "Falcon", "FileApi", "EntityModel", "$state", "X2jsService",  
	                             function($scope, $timeout, Falcon, FileApi, EntityModel, $state, X2jsService) {
		
		$scope.fileJson = {};
	
		$scope.handleFile = function (evt) {

			FileApi.loadFile(evt).then(function () {       
	            Falcon.postSubmitEntity(FileApi.fileRaw, EntityModel.type).success(function (response) {
                    $scope.valid = true;
                    $scope.serverResponse = response;
                    $state.go('main'); 
                    $timeout(function() {
                        $scope.serverResponse.status = undefined;
                    }, 3000);
               
	            }).error(function (err) {   
	                var error = X2jsService.xml_str2json( err );            
                    $scope.valid = false;                 
                    $scope.serverResponse = error.result; 
                    console.log($scope.serverResponse);
                    console.log(err);
                    $state.go('main'); 
	            });   
			});
			     
		};		
       
	}]);	
	
	app.controller('mainCtrl', [ "$scope", "Falcon", "EntityModel", "FileApi", "$state", "X2jsService", 
                                           function($scope, Falcon, EntityModel, FileApi, $state, X2jsService) {     
        $scope.closeAlert = function () {
            $scope.serverResponse.status = undefined;
        };
  
    }]); 
    
    app.controller('dashboardCtrl', [ "$scope", "Falcon", "FileApi", "EntityModel", "$state", "X2jsService",
                                     function($scope, Falcon, FileApi, EntityModel, $state, X2jsService) {
        
        
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
            Falcon.getEntityDefinition(type, name).success(function (data) { console.log( data ); })
                .error(function (err) { console.log( err ); });  
        };
        $scope.editEntity = function (type, name) {         
            console.log("edit " + type + " - " + name);
        };
        $scope.relationsEntity = function (type, name) {         
            console.log("relations " + type + " - " + name);
        };
        
       
    }]);  
    
    app.controller('formCtrl', [ "$scope", "Falcon", "EntityModel", "$state", "X2jsService", 
                                           function($scope, Falcon, EntityModel, $state, X2jsService) {     

        $scope.entity = {};
        
        
       
    }]);    
    
      
})();
