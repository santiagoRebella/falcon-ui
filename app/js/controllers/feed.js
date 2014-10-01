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
  var feedModule = angular.module('app.controllers.feed', []);

  feedModule.controller('FeedController', [ "$scope", function($scope) {

    $scope.init = function() {
      $scope.feed = newFeed();
    };

    $scope.init();


    $scope.saveEntity = function() {
      console.log('FeedController.saveEntity  not implemented yet');
    };


    function newFeed() {
      return {
        name: null,
        description: null,
        groups: null,
        tags: [{key: null, value: null}],
        ACL: {owner: null, group: null, permission: '*'},
        schema: {location: '/', provider: null}
      };
    }

  }]);

  feedModule.controller('FeedGeneralInformationController', [ "$scope",function($scope) {

    $scope.init = function() {
      $scope.fileSysSection = true;
      $scope.sourceSection = true;
      $scope.clusterSelectedSection = 0;
      $scope.validations = defineValidations();

    };

    $scope.init();

    $scope.addTag = function() {
      $scope.feed.tags.push({key: null, value: null});
    };

    $scope.removeTag = function(index) {
      if(index >= 0 && $scope.feed.tags.length > 1) {
        $scope.feed.tags.splice(index, 1);
      }
    };

    function defineValidations() {
      return {
        id: validate(/^(([a-zA-Z]([\\-a-zA-Z0-9])*){1,39})$/, 39, 0, true),
        freeText: validate(/^([\sa-zA-Z0-9]){1,40}$/),
        alpha: validate(/^([a-zA-Z0-9]){1,20}$/),
        commaSeparated: validate(/^[a-zA-Z0-9,]{1,80}$/),
        unixId: validate(/^([a-z_][a-z0-9_\.]{0,30})$/),
        unixPermissions: validate(/^((([0-7]){1,4})|(\*))$/),
        osPath: validate(/^[^\0]+$/)
      };
    }

    function validate(pattern, maxlength, minlength, required) {
      return {
        pattern: pattern,
        maxlength: maxlength || 1000,
        minlength: minlength || 0,
        required: required || false
      };
    }


  }]);

  feedModule.controller('FeedPropertiesController', [ "$scope",function($scope) {
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
/*
        $scope.isActive = function (route) {
          return route === $state.$current.name;
        };*/
/*
*/


})();
