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
  var feedModule = angular.module('app.controllers.feed', ['app.services']);

  feedModule.controller('FeedController', [ "$scope", "$state", "Falcon", "EntityModel", "X2jsService",
    function($scope, $state, Falcon, EntityModel, X2jsService) {

    $scope.init = function() {
      $scope.feed = newFeed();
      $scope.validations = defineValidations();
    };

    $scope.init();


    $scope.saveEntity = function() {
      console.log('todo');
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
        schema: {location: null, provider: null},
        frequency: {quantity: null, unit: 'hours'},
        lateArrival: {active: false, cutOff: {quantity: null, unit: 'hours'}},
        availabilityFlag: null,
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
          selected: true,
          retention: {action: null, quantity: null, unit: 'hours'},
          validity: {start: {date: null, time: null}, end: {date: null, time: null}, timezone: null},
          catalog: {
            active: false,
            catalogTable: {
              uri: null,
              focused: false
            }
          }
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

  feedModule.controller('FeedLocationController', [ "$scope",function($scope) {

    $scope.toggleStorage = function() {
      toggle($scope.feed.storage.fileSystem);
      toggle($scope.feed.storage.catalog);
    };

    function toggle(storage) {
      storage.active = !storage.active;
    }

  }]);

  feedModule.controller('FeedClustersController', [ "$scope","clustersList",
    function($scope, clustersList) {


      unwrapClusters(clustersList);

      $scope.updateRetention = function() {
        if($scope.selectedCluster.retention.action === 'archive' && $scope.selectedCluster.type === 'source') {
          $scope.allClusters.length = 0;
          $scope.allClusters.concat($scope.feed.clusters);

          $scope.feed.clusters.length = 0;
          $scope.feed.clusters.push($scope.sourceCluster);
          $scope.feed.clusters.push($scope.archiveCluster);

          $scope.sourceCluster.selected = false;
          $scope.archiveCluster.selected = true;
          $scope.archiveCluster.active = true;
          $scope.selectedCluster = $scope.archiveCluster;
        }

        if($scope.selectedCluster.retention.action !== 'archive'&& $scope.selectedCluster.type === 'source' && $scope.archiveCluster.active) {
          $scope.archiveCluster.selected = false;
          $scope.feed.clusters.length = 0;
          $scope.allClusters.length = 0;
          $scope.feed.clusters.push($scope.sourceCluster);
          $scope.sourceCluster.selected = true;
          $scope.archiveCluster.active = false;
        }
      };

      $scope.addCluster = function() {
        $scope.selectedCluster.selected = false;
        var cluster = $scope.newCluster(true);
        $scope.feed.clusters.push(cluster);
        $scope.selectedCluster = cluster;
      };

      $scope.newCluster = function(selected) {
        return {
          name: null,
          type: 'target',
          selected: selected,
          retention: {action: null, quantity: null, unit: 'hours'},
          validity: {start: {date: null, time: null}, end: {date: null, time: null}, timezone: null},
          catalog: {
            active: false,
            catalogTable: {
              uri: null,
              focused: false
            }
          }
        };
      };

      $scope.handleCluster = function(cluster, index) {
        if(cluster.selected) {
          $scope.removeCluster(index);
        } else {
          $scope.selectCluster(cluster);
        }
      };

      $scope.selectCluster = function (cluster) {
        $scope.selectedCluster.selected = false;
        cluster.selected = true;
        $scope.selectedCluster = cluster;
      };

      $scope.removeCluster = function(index) {
        if(index >= 0 && $scope.feed.clusters.length > 1 &&
          $scope.feed.clusters[index].type !== 'source' &&
          !$scope.archiveCluster.active) {
          $scope.feed.clusters.splice(index, 1);
          $scope.selectCluster($scope.sourceCluster);
        }
      };

      function unwrapClusters(clusters) {
        $scope.clusterList = [];
        var typeOfData = Object.prototype.toString.call(clusters.entity);
        if(typeOfData === "[object Array]") {
          $scope.clusterList = clusters.entity;
        } else if(typeOfData === "[object Object]") {
          $scope.clusterList = [clusters.entity];
        } else {
          console.log("type of data not recognized");
        }
      }


      $scope.selectedCluster = $scope.selectedCluster || $scope.feed.clusters[0];
      $scope.sourceCluster = $scope.sourceCluster || $scope.feed.clusters[0];
      $scope.archiveCluster = $scope.newCluster(false);
      $scope.archiveCluster.active = false;
      $scope.allClusters = [];

    }]);



  feedModule.controller('FeedSummaryController', [ "$scope", "$filter", function($scope, $filter) {


    $scope.hasTags = function() {
      var filteredTags = $filter('filter')($scope.feed.tags, {key: '!!'});
      return filteredTags.length > 0;
    };

    $scope.optional = function(input, output) {
      return input ? (output || input) : 'Not specified';
    };

  }]);

})();
