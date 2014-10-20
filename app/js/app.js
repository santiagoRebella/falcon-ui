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

  var app = angular.module('app', [
    'ui.bootstrap', 'ui.router', 'app.controllers', 'app.directives', 'app.services',
    'app.controllers.layout', 'app.controllers.cluster', 'app.controllers.feed',
    'app.controllers.entityDetails',
    'app.services.entity', 'app.services.entity.model', 'falcon.util.datepicker',
    'app.services.validation', 'app.directives.entity', 'checklist-model'
  ]);

  app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'html/mainTpl.html',
        controller: 'DashboardCtrl'
      })
      .state('entityDetails', {
        templateUrl: 'html/entityDetailsTpl.html',
        controller: 'EntityDetailsCtrl'
      }) 
      .state('forms', {
        templateUrl: 'html/formsTpl.html'
      }) 
      .state('forms.cluster', {
        controller: 'ClusterFormCtrl',
        templateUrl: 'html/cluster/clusterFormTpl.html'
      })
      .state('forms.cluster.general', {
        templateUrl: 'html/cluster/clusterFormGeneralStepTpl.html'
      })
      .state('forms.cluster.summary', {
        templateUrl: 'html/cluster/clusterFormSummaryStepTpl.html'
      })
      .state('forms.feed', {
        templateUrl: 'html/feed/feedFormTpl.html',
        controller: 'FeedController'
      })
      .state('forms.feed.general', {
        templateUrl: 'html/feed/feedFormGeneralStepTpl.html',
        controller: 'FeedGeneralInformationController'
      })
      .state('forms.feed.properties', {
        templateUrl: 'html/feed/feedFormPropertiesStepTpl.html',
        controller: 'FeedPropertiesController'
      })
      .state('forms.feed.location', {
        templateUrl: 'html/feed/feedFormLocationStepTpl.html',
        controller: 'FeedLocationController'
      })
      .state('forms.feed.clusters', {
        templateUrl: 'html/feed/feedFormClustersStepTpl.html',
        controller: 'FeedClustersController',
        resolve: {
          clustersList: ['EntityService', function(EntityService) {
            return EntityService.findByType('cluster').then(
              function(response) {
                return response.data;
              });
          }]
        }
      })
      .state('forms.feed.summary', {
        templateUrl: 'html/feed/feedFormSummaryStepTpl.html',
        controller: 'FeedSummaryController'
      });
  }]);

  app.run(['$rootScope', '$state', '$stateParams', function ($rootScope) {
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.log('Manual log of stateChangeError: ' + error);
      });
  }]);

})();
