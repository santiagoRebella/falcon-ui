(function () {

  var app = angular.module('app', [
                                    'ui.bootstrap', 'ui.router', 'app.controllers', 'app.directives', 'app.services', 
                                    'app.controllers.layout', 'app.controllers.cluster', 'app.controllers.feed', 
                                    'app.services.entity', 'app.services.entity.model', 'falcon.util.datepicker', 
                                    'app.services.validation'
                                  ]); 

  app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'html/mainTpl.html',
        controller: 'DashboardCtrl'
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
      .state('main.forms.feed.summary', {
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
