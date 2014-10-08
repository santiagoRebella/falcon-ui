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
  var feedModule = angular.module('app.controllers.feed', ['app.services', 'app.services.entity.model', 'app.services.entity.transformer', 'app.services.entity.factory']);

  feedModule.controller('FeedController', [ "$scope", "$state", "$timeout", "Falcon", "EntityModel", "X2jsService", "EntityTransformerFactory", "EntityFactory",
    function($scope, $state, $timeout, Falcon, EntityModel, X2jsService, transformerFactory, entityFactory) {

    $scope.init = function() {
      $scope.feed = entityFactory.newFeed();
      $scope.validations = defineValidations();
      $scope.startOpened = false;
      $scope.endOpened = false;
    };

    $scope.init();


    $scope.transform = function() {

      var propertyTransform = transformerFactory
        .transform('key', '_name')
        .transform('value', '_value', function(value) {
          return value.quantity ? frequencyToString(value) : value;
        });

      var locationTransform = transformerFactory
        .transform('type', '_type')
        .transform('path', '_path');

      var clusterTransform = transformerFactory
        .transform('name', '_name')
        .transform('type', '_type')
        .transform('validity.start', 'validity._start', timeAndDateToString)
        .transform('validity.end', 'validity._end', timeAndDateToString)
        .transform('retention', 'retention._limit', frequencyToString)
        .transform('retention.action', 'retention._action')
        .transform('storage.fileSystem', 'locations.location', function(fileSystem) {
          return $scope.feed.storage.fileSystem.active ? transformfileSystem(fileSystem) : null;
        })

        .transform('storage.catalog', 'table', function(catalog) {
          return $scope.feed.storage.catalog.active ? transformCatalog(catalog) : null;
        });

      var transform = transformerFactory
        .transform('name', 'feed._name')
        .transform('description', 'feed._description')
        .transform('tags', 'feed.tags', keyValuePairs)
        .transform('groups', 'feed.groups')
        .transform('availabilityFlag', 'feed.availabilityFlag')
        .transform('frequency', 'feed.frequency', frequencyToString)
        .transform('timezone', 'feed.timezone')
        .transform('lateArrival.cutOff', 'feed.late-arrival._cut-off', frequencyToString)
        .transform('clusters', 'feed.clusters.cluster', function(clusters) {
          return clusters.map(function(cluster) {
            return clusterTransform.apply(cluster, {});
          });
        })
        .transform('storage.fileSystem', 'feed.locations.location', function(fileSystem) {
          return fileSystem.active ? transformfileSystem(fileSystem) : null;
        })
        .transform('storage.catalog', 'feed.table', function(catalog) {
          return catalog.active ? transformCatalog(catalog) : null;
        })
        .transform('ACL', 'feed.ACL', emptyElement)
        .transform('ACL.owner', 'feed.ACL._owner')
        .transform('ACL.group', 'feed.ACL._group')
        .transform('ACL.permission', 'feed.ACL._permission')
        .transform('schema', 'feed.schema', emptyElement)
        .transform('schema.location', 'feed.schema._location')
        .transform('schema.provider', 'feed.schema._provider')
        .transform('allproperties', 'feed.properties.property', function(properties) {
          return properties.filter(emptyValue).filter(emptyFrequency).map(function(property) {
            return propertyTransform.apply(property, {});
          });
        });

      function transformfileSystem (fileSystem) {
        return fileSystem.locations.map(function(location) {
          return locationTransform.apply(location, {});
        });
      }

      function transformCatalog(catalog) {
        return {_uri : catalog.catalogTable.uri};
      }

      if($scope.feed.properties) {
        $scope.feed.allproperties = $scope.feed.properties.concat($scope.feed.customProperties);
      }

      var result = transform.apply($scope.feed, new FeedModel());

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

    //------------Datepickers-----------------//
    $scope.today = function() {
      $scope.startDate = new Date();
      $scope.endDate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.startDate = null;
    };
    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = !$scope[opened];
    };
    $scope.dateOptions = {
      formatYear: 'shortDate',
      startingDay: 1
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

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

    function FeedModel() {
      this.feed = {_xmlns: "uri:falcon:feed:0.1"};
    }

    function keyValuePairs(input) {
      return input.filter(emptyKey).map(entryToString).join(',');
    }

    function emptyKey (input) {
      return input.key;
    }

    function emptyValue (input) {
      return input && input.value;
    }

    function emptyFrequency (input) {
      return input.value.unit ? input.value.quantity : input.value;
    }

    function entryToString(input) {
      return input.key + '=' + input.value;
    }

    function frequencyToString(input) {
      return input.quantity ? input.unit + '(' + input.quantity + ')' : null;
    }

    function timeAndDateToString(input) {
      return input.date + 'T'  + input.time + 'Z';
    }

    function emptyElement() {return {};}

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

  feedModule.controller('FeedClustersController', ["$scope","clustersList", "EntityFactory",

    function($scope, clustersList, entityFactory) {

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
        return entityFactory.newCluster('target', selected);
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

    if($scope.transform) {
      $scope.transform();
    }

    $scope.hasTags = function() {
      var filteredTags = $filter('filter')($scope.feed.tags, {key: '!!'});
      return filteredTags.length > 0;
    };

    $scope.optional = function(input, output) {
      return input ? (output || input) : 'Not specified';
    };

  }]);

})();
