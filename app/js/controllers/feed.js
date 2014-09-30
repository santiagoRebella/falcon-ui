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
   * @requires clusters the list of clusters to display for selection of source
   * @requires EntityModel the entity model to copy the feed entity from
   * @requires Falcon the falcon entity service
   */
  angular.module('app.controllers.feed', ['app.services'])
    .controller('FeedController', [ "$scope", "$timeout", "Falcon", "EntityModel", "$state", "clusters",

      function($scope, $timeout, Falcon, EntityModel, $state, clusters) {

        $scope.init = function() {
          $scope.feedEntity = angular.copy(EntityModel.feedModel);
          $scope.fileSysSection = true;
          $scope.sourceSection = true;
          $scope.clusterSelectedSection = 0;
          $scope.clustes = clusters;
          $scope.feedForm = {};
          $scope.feedForm.tags = [{key: null, value: null}];
        };

        $scope.init();

        $scope.addTag = function() {
          $scope.feedForm.tags.push({key: null, value: null});
        };

        $scope.removeTag = function() {
          $scope.feedForm.tags.pop();
        };
/*
        $scope.$watch(function () {
          return $scope.temp;
        }, function() {
          EntityModel.feedModel.feed.frequency = $scope.temp.freqUnit + "(" + $scope.temp.freqNumber + ")";
          EntityModel.feedModel.feed["late-arrival"]["_cut-off"] = $scope.temp.lateArrivalUnit + "(" + $scope.temp.lateArrivalNumber + ")";
        }, true);*/

/*        Falcon.getEntities("cluster")
          .success(function (data) {
            var typeOfData = Object.prototype.toString.call(data.entity);
            if(data === "null") { $scope.clusterList = []; }
            else if(typeOfData === "[object Array]") { $scope.clusterList = data.entity; }
            else if(typeOfData === "[object Object]") { $scope.clusterList[0] = data.entity; }
            else { console.log("type of data not recognized"); }
          })
          .error(function (err) { console.log( err ); });*/

        $scope.isActive = function (route) {
          return route === $state.$current.name;
        };

        $scope.temp = {
          freqNumber : 1,
          freqUnit: "days",
          lateArrivalNumber: "",
          lateArrivalUnit: "",
          newPropertiesArray : []
        };
        $scope.addProperty = function () {
          EntityModel.feedModel.feed[$scope.temp.newPropertyName] = $scope.temp.newPropertyValue;
          $scope.temp.newPropertiesArray.push({name: $scope.temp.newPropertyName, value: $scope.temp.newPropertyValue});
        };
        $scope.addReplicationCluster = function () {
          var repClusterObj = { cluster: { validity: { _start: "", _end: "" }, retention: { _limit: "", _action: ""}, _name: "", _type: "target" } };
          $scope.feedEntity.feed.clusters.push(repClusterObj);
        };
        $scope.addArchiveCluster = function () {
          var arcClusterObj = { cluster: { validity: { _start: "", _end: "" }, retention: { _limit: "", _action: ""}, _name: "", _type: "target" } };
          $scope.feedEntity.feed.clusters.push(arcClusterObj);
        };

      }]);
})();
