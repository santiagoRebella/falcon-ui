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
  var feedModule = angular.module('app.controllers.feed');

  feedModule.controller('FeedController',
    [ "$scope", "$state", "$timeout",
      "Falcon", "EntityModel", "X2jsService",
      "EntityTransformerFactory", "EntityFactory",
      "DatePickerFactory", "ValidationService",
      function($scope, $state, $timeout, Falcon, EntityModel,
               X2jsService, transformerFactory, entityFactory,
               datePickerFactory, validationService) {

        $scope.loadOrCreateEntity = function() {
          var feedModel = $scope.feedModel;
          $scope.feedModel = null;
          return feedModel ? entityFactory.deserialize(feedModel) : entityFactory.newFeed();
        };

        $scope.init = function() {
          $scope.feed = $scope.loadOrCreateEntity();
          $scope.validations = validationService.define();
          $scope.startDatePicker = datePickerFactory.newDatePicker();
          $scope.endDatePicker= datePickerFactory.newDatePicker();
        };

        $scope.init();


        $scope.transform = function() {

          if($scope.feed.properties) {
            $scope.feed.allproperties = $scope.feed.properties.concat($scope.feed.customProperties);
          }

          var result = entityFactory.transform($scope.feed);
          var xmlStr = X2jsService.json2xml_str(result);
          $scope.prettyXml = X2jsService.prettifyXml(xmlStr);
          $scope.xml = xmlStr;
          return xmlStr;
        };


        $scope.saveEntity = function() {
          Falcon.postSubmitEntity($scope.xml, "feed").success(function (response) {
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

        $scope.isActive = function (route) {
          return route === $state.$current.name;
        };

        $scope.capitalize = function(input) {
          return input.charAt(0).toUpperCase() + input.slice(1);
        };

        $scope.parseDate = function(input) {
          return input ? input.split('T')[0] : input;
        };

        $scope.parseTime = function(input) {
          if (input) {
            var partialTime = input.split('T')[1].split(':');
            partialTime = partialTime[0] + ':' + partialTime[1];
            return partialTime;
          }
          return 'Not defined';
        };

        $scope.appendVariable = function(timeVariable, holder, fieldName) {
          holder[fieldName] = holder[fieldName] ? (holder[fieldName] + '-' + timeVariable) : timeVariable;
          holder.focused = false;
        };

        $scope.cancel = function() {
          console.log('cancel called');
          $scope.feed = null;
        };

      }]);

})();
