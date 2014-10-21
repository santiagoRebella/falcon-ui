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

  var entityDetails = angular.module('app.controllers.entityDetails', ['app.services']);

  entityDetails.controller('EntityDetailsCtrl', ["$scope", "$state", "EntityModel", function($scope, $state, EntityModel) {
    $scope.entityDetailsModel = EntityModel.detailsPageModel;
    $scope.type = (function () {
      if($scope.entityDetailsModel.cluster !== undefined) {
        return "cluster";
      }
      if($scope.entityDetailsModel.feed !== undefined) {
        return "feed";
      }
      if($scope.entityDetailsModel.process !== undefined) {
        return "process";
      }
    })();
    $scope.viewDock = $scope.entityDetailsModel[$scope.type];
    $scope.cloneEntity = function (type, name) {
      EntityModel[type + "Model"] = $scope.entityDetailsModel;
      $state.go('forms.' + type + ".general");
    };
     
  }]);


})();
