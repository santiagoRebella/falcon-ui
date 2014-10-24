/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /***
   * @ngdoc controller
   * @name app.controllers.feed.FeedController
   * @requires EntityModel the entity model to copy the feed entity from
   * @requires Falcon the falcon service to talk with the Falcon REST API
   */
  var app = angular.module('app.controllers.cluster', [ 'app.services', 'app.services.entity.model' ]);
                                                      
  app.controller('ClusterFormCtrl', [ "$scope", "$timeout", "Falcon", "EntityModel", "$state", "X2jsService", 
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
     if($scope.clusterEntity.cluster.properties.property.length === 0) {
       delete $scope.clusterEntity.cluster.properties;
     }       
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
    
    
    
    $scope.tempmodel = { _name: "", _value: ""};
    
    $scope.addProperty = function (k, v) {    
      if(!$scope.clusterEntity.cluster.properties) { 
        $scope.clusterEntity.cluster.properties = {}; 
        $scope.clusterEntity.cluster.properties.property = []; 
      }
      $scope.clusterEntity.cluster.properties.property.push({ _name: k, _value: v});
      $scope.tempmodel = { _name: "", _value: ""};
    };

    $scope.removeProperty = function(index) {
      if(index >= 0 && $scope.clusterEntity.cluster.properties.property.length >= 1) {
        $scope.clusterEntity.cluster.properties.property.splice(index, 1);
      }
    };

   $scope.transform = function() {
     var xmlStr = X2jsService.json2xml_str(angular.copy($scope.clusterEntity));
     $scope.prettyXml = X2jsService.prettifyXml(xmlStr);
     $scope.xml = xmlStr;
     return xmlStr;
   };

   var xmlPreviewCallback = function() {
     $scope.transform();
     $timeout(xmlPreviewCallback, 1000);
   };

   $timeout(xmlPreviewCallback, 1000);

    
    
  }]);    
})();




