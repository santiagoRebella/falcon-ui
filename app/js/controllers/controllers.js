(function () {
	
	var app = angular.module('app.controllers', ['app.services', 'app.services.entity.model']);


	app.controller('rootCtrl', [ "$scope", "$timeout", "Falcon", "FileApi", "EntityModel", "$state", "X2jsService",
	                             function($scope, $timeout, Falcon, FileApi, EntityModel, $state, X2jsService) {
	
		$scope.handleFile = function (evt) {

			FileApi.loadFile(evt).then(function () {       
	            Falcon.postSubmitEntity(FileApi.fileRaw, EntityModel.type).success(function (response) {
                    Falcon.success = true;
                    Falcon.serverResponse = response;
                    $state.go('main'); 
                    $timeout(function() {
                        Falcon.serverResponse = { serverResponse: null, success: null };
                    }, 5000);
               
	            }).error(function (err) {   
	                var error = X2jsService.xml_str2json(err);            
                    Falcon.success = false;                 
                    Falcon.serverResponse = error.result; 
                    $state.go('main'); 
	            });   
			});
			     
		};		
       
	}]);	
	
	app.controller('mainCtrl', [ "$scope", "Falcon", "EntityModel", "FileApi", "$state", "X2jsService", 
                                           function($scope, Falcon, EntityModel, FileApi, $state, X2jsService) {    
        $scope.serverResponse = Falcon.serverResponse; 
        $scope.$watch(function () { 
                return Falcon.serverResponse; 
            }, function() {
                $scope.serverResponse = Falcon.serverResponse; 
                $scope.success = Falcon.success; 
                refreshLists(); 
        }, true);
        
        
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
                .success(function (data) { 
                    Falcon.success = true;
                    Falcon.serverResponse = data; 
                })
                .error(function (err) { 
                    var error = X2jsService.xml_str2json(err);            
                    Falcon.success = false;                 
                    Falcon.serverResponse = error.result;  
                
                });  
        };
        $scope.cloneEntity = function (type, name) {         
            Falcon.getEntityDefinition(type, name)
                .success(function (data) {             
                    EntityModel[type + "Model"] = X2jsService.xml_str2json(data);            
                    console.log(JSON.stringify(EntityModel[type + "Model"]));          
                    $state.go('main.forms.' + type + ".general");
                 })
                .error(function (err) { 
                    var error = X2jsService.xml_str2json(err);            
                    Falcon.success = false;                 
                    Falcon.serverResponse = error.result;  
                 });  
        };
        $scope.editEntity = function (type, name) {

          Falcon.getEntityDefinition(type, name)
            .success(function (data) {
              var entityModel = X2jsService.xml_str2json(data);
              var modelName = (type + "Model");
              EntityModel[modelName] = entityModel;
              $scope[modelName] = angular.copy(entityModel);
              console.log('edit called: ');
              console.log($scope.feedModel);
              $scope.editingMode = true;
              $state.go('main.forms.' + type + ".general");
            })
            .error(function (err) {
              var error = X2jsService.xml_str2json(err);
              Falcon.success = false;
              Falcon.serverResponse = error.result;
            });
        };
        $scope.playEntity = function (type, name) {         
            console.log("play " + type + " - " + name);
        };
        $scope.stopEntity = function (type, name) {         
            console.log("stop " + type + " - " + name);
        };
        $scope.pauseEntity = function (type, name) {         
            console.log("pause " + type + " - " + name);
        };
        $scope.relationsEntity = function (type, name) {         
            console.log("relations " + type + " - " + name);
        };                                                                                
        $scope.closeAlert = function () {
            $scope.serverResponse.status = undefined;
        };
        $scope.resetCluster = function () {
            EntityModel.clusterModel = {cluster:{interfaces:{interface:[{_type:"readonly",_endpoint:"hftp://",_version:""},
                    {_type:"write",_endpoint:"hdfs://",_version:""},{_type:"execute",_endpoint:"",_version:""},
                    {_type:"workflow",_endpoint:"http://",_version:""},{_type:"messaging",_endpoint:"tcp://",_version:""}]},
                    locations:{location:[]},_xmlns:"uri:falcon:cluster:0.1",_name:"",_description:"",_colo:""}
            };
        };
  
    }]); 
    
    app.controller('clusterFormCtrl', [ "$scope", "$timeout", "Falcon", "EntityModel", "$state", "X2jsService", 
                                           function($scope, $timeout, Falcon, EntityModel, $state, X2jsService) {     
        
        $scope.secondStep = false;  
        $scope.newLocation = {};
        $scope.clusterEntity = EntityModel.clusterModel;
        $scope.$watch(function () { 
                return EntityModel.clusterModel; 
            }, function() {
                $scope.clusterEntity = EntityModel.clusterModel;
        }, true);    
            
       
       
       $scope.addLocation = function () {   
           if(!$scope.newLocation._name || !$scope.newLocation._path) {
               console.log('location empty');  
           }    
           else {
               $scope.clusterEntity.cluster.locations.location.push($scope.newLocation);
               $scope.newLocation = {};
           }                
       };
       $scope.removeLocation = function (index) {
           $scope.clusterEntity.cluster.locations.location.splice(index, 1);
       }; 
       
       $scope.goSummaryStep = function () {         
           //takes out the $$hashKey from object      
           $scope.jsonString = angular.toJson($scope.clusterEntity);
           //goes back to js to have x2js parse it correctly
           $scope.jsonString = JSON.parse($scope.jsonString);
           $scope.jsonString = X2jsService.json2xml_str($scope.jsonString);  
           $scope.secondStep = true;       
       };
       $scope.goGeneralStep = function () {
           $scope.secondStep = false;        
       };
       $scope.saveCluster = function () {
        
           Falcon.postSubmitEntity($scope.jsonString, "cluster").success(function (response) {
                Falcon.success = true;
                Falcon.serverResponse = response;
                $state.go('main'); 
                $timeout(function() {
                    Falcon.serverResponse = { serverResponse: null, success: null };
                }, 5000); 
            }).error(function (err) {   
                var error = X2jsService.xml_str2json(err);            
                Falcon.success = false;                 
                Falcon.serverResponse = error.result; 
                
            });     
       };
       
       $scope.updateCluster = function () {
           Falcon.postUpdateEntity($scope.jsonString, "cluster", $scope.clusterEntity.cluster._name).success(function (response) {
                Falcon.success = true;
                Falcon.serverResponse = response;
                $state.go('main'); 
                $timeout(function() {
                    Falcon.serverResponse = { serverResponse: null, success: null };
                }, 5000); 
            }).error(function (err) {   
                var error = X2jsService.xml_str2json(err);            
                Falcon.success = false;                 
                Falcon.serverResponse = error.result; 
                $state.go('main'); 
            });     
       };
    }]);    

})();
