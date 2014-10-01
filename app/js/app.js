(function () {

  var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'app.controllers', 'app.directives', 'app.services', 'app.controllers.layout', 'app.controllers.feed', 'app.services.entity']);

  app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'html/landingTpl.html'
      })
      .state('main', {
        templateUrl: 'html/mainTpl.html',
        controller: 'mainCtrl'
      })
      .state('main.forms', {
        templateUrl: 'html/formsTpl.html'
      })
      .state('main.forms.cluster', {
        controller: 'clusterFormCtrl',
        templateUrl: 'html/cluster/clusterFormTpl.html'
      })
      .state('main.forms.cluster.general', {
        templateUrl: 'html/cluster/clusterFormGeneralStepTpl.html'
      })
      .state('main.forms.cluster.summary', {
        templateUrl: 'html/cluster/clusterFormSummaryStepTpl.html'
      })
      .state('main.forms.feed', {
        templateUrl: 'html/feed/feedFormTpl.html',
        controller: 'FeedController'
      })
      .state('main.forms.feed.general', {
        templateUrl: 'html/feed/feedFormGeneralStepTpl.html',
        controller: 'FeedGeneralInformationController'
      })
      .state('main.forms.feed.properties', {
        templateUrl: 'html/feed/feedFormPropertiesStepTpl.html',
        controller: 'FeedPropertiesController'
      })
      .state('main.forms.feed.location', {
        templateUrl: 'html/feed/feedFormLocationStepTpl.html',
        controller: 'FeedLocationController'
      })
      .state('main.forms.feed.clusters', {
        templateUrl: 'html/feed/feedFormClustersStepTpl.html'/*,
        resolve: {
          clusters: ['EntityService', function(EntityService) {
            return EntityService.findByType('cluster').then(
              function(response) {
                return response.data;
              });
          }
          ]
        }*/
      })
      .state('main.forms.feed.summary', {
        templateUrl: 'html/feed/feedFormSummaryStepTpl.html'
      })
      .state('main.dashboard', {
        templateUrl: 'html/dashboardTpl.html',
        controller: 'dashboardCtrl'
      });
  }]);

  app.run(['$rootScope', '$state', '$stateParams', function ($rootScope) {
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.log('error: ' + error);
      });
  }]);

})();
