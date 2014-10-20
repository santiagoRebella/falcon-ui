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

  var app = angular.module('app.directives.entity', []);

  app.directive('entitySummary', function() {
    return {
      restrict: "E",
      controller: 'EntitySummaryCtrl',
      link: function(scope) {
        scope.init();
        scope.group();
      },
      scope: {
        entities: '=',
        statuses: '=',
        satusfield: '@'
      },
      templateUrl: 'html/directives/entitySummaryDv.html'
    };
  });


  app.controller('EntitySummaryCtrl', ['$scope', function($scope) {

    $scope.init = function() {
      $scope.groups = [];
    };

    $scope.group = function() {
      $scope.groups = {totals: buildTotals(), partials: buildPartials()};
    };

    function buildTotals() {
      var submitted = new Metric('SUBMITTED', $scope.entities.length);
      var totals = new MetricsGroup('totals', [ submitted]);
      totals.SUBMITTED = submitted;
      return  totals;
    }

    function buildPartials() {
      var counts = partialCounts($scope.entities, $scope.satusfield, $scope.statuses);
      return new MetricsGroup('partials', counts);
    }

    function partialCounts(entities, field, statuses) {
      return countBy(entities, field, statuses);
    }


    function countBy(entities, field, statuses) {

      var statusCountsMap = {};
      var metrics = [];

      entities.forEach(function(entity) {
        var entityFieldValue = entity[field];

        if(statusCountsMap[entityFieldValue]) {
          statusCountsMap[entityFieldValue] = statusCountsMap[entityFieldValue] + 1;
        } else {
          statusCountsMap[entityFieldValue] = 1;
        }
      });

      angular.forEach(statuses, function(status) {
        var statusCount = statusCountsMap[status];
        if(statusCount) {
          metrics.push(new Metric(status, statusCount));
        } else {
          metrics.push(new Metric(status, 0));
        }
      });

      return metrics;
    }

  }]);

  function MetricsGroup(name, metrics) {
    this.name = name;
    this.metrics = metrics;
  }

  function Metric(key, value) {
    this.key = key;
    this.value = value;
  }


})();