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

  feedModule.controller('FeedController', [ "$scope", "$state", function($scope, $state) {

    $scope.init = function() {
      $scope.feed = newFeed();
      $scope.validations = defineValidations();
    };

    $scope.init();


    $scope.saveEntity = function() {
      console.log('FeedController.saveEntity  not implemented yet');
    };

    $scope.isActive = function (route) {
      return route === $state.$current.name;
    };

    $scope.capitalize = function(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    };

    $scope.appendVariable = function(timeVariable, holder, fieldName) {
      holder[fieldName] = holder[fieldName] ? (holder[fieldName] + '-' + timeVariable) : timeVariable;
      holder.focused = false;
    };

    function newFeed() {
      return {
        name: null,
        description: null,
        groups: null,
        tags: [{key: null, value: null}],
        ACL: {owner: null, group: null, permission: '*'},
        schema: {location: '/', provider: null},
        frequency: {quantity: null, unit: 'hours'},
        lateArrival: {active: false, cutOff: {quantity: null, unit: 'hours'}},
        availabilityFlag: false,
        properties: {
          queueName: null,
          jobPriority: 'NORMAL',
          timeout: {quantity: null, unit: 'hours'},
          parallel: null,
          maxMaps: null,
          mapBandwidthKB: null
        },
        customProperties: [{key: null, value: null}],
        storage: {
          fileSystem: {
            active: true,
            locations: [
              {type: 'data', path: '/', focused: false},
              {type: 'stats', path: '/', focused: false},
              {type: 'meta', path: '/', focused: false}
            ]
          },
          catalog: {
            active: false,
            catalogTable: {
              uri: null,
              focused: false
            }
          }
        },
        clusters: [{
          name: null,
          type: 'source',
          selected: true
        }]
      };
    }

    function defineValidations() {
      return {
        id: validate(/^(([a-zA-Z]([\\-a-zA-Z0-9])*){1,39})$/, 39, 0, true),
        freeText: validate(/^([\sa-zA-Z0-9]){1,40}$/),
        alpha: validate(/^([a-zA-Z0-9]){1,20}$/),
        commaSeparated: validate(/^[a-zA-Z0-9,]{1,80}$/),
        unixId: validate(/^([a-z_][a-z0-9_\.]{0,30})$/),
        unixPermissions: validate(/^((([0-7]){1,4})|(\*))$/),
        osPath: validate(/^[^\0]+$/),
        twoDigits: validate(/^([0-9]){1,2}$/),
        tableUri: validate(/^[^\0]+$/)
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

  feedModule.controller('FeedGeneralInformationController', [ "$scope", function($scope) {

    $scope.addTag = function() {
      $scope.feed.tags.push({key: null, value: null});
    };

    $scope.removeTag = function(index) {
      if(index >= 0 && $scope.feed.tags.length > 1) {
        $scope.feed.tags.splice(index, 1);
      }
    };

  }]);

  feedModule.controller('FeedPropertiesController', [ "$scope",function($scope) {
    $scope.addCustomProperty = function () {
      $scope.feed.customProperties.push({key: null, value: null});
    };

    $scope.removeCustomProperty = function(index) {
      if(index >= 0 && $scope.feed.customProperties.length > 1) {
        $scope.feed.customProperties.splice(index, 1);
      }
    };
  }]);

  feedModule.controller('FeedLocationController', [ "$scope",function($scope) {

    $scope.toggleStorage = function() {
      toggle($scope.feed.storage.fileSystem);
      toggle($scope.feed.storage.catalog);
    };

    function toggle(storage) {
      storage.active = !storage.active;
    }

  }]);

  feedModule.controller('FeedClustersController', [ "$scope",
    function($scope) {

      var i = 0;
      var j = 0;
      $scope.addCluster = function() {
        console.log('add: ' + i++);
      };

      $scope.removeCluster = function() {
        console.log('remove: ' + j++);
      };

  }]);

})();
