(function () {
    
    var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'app.controllers', 'app.directives', 'app.services']);
            
    app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        
        //$httpProvider.defaults.headers.post = {'Content-Type': 'application/xml'};
            
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
            .state('landing', {
                url: '/',
                templateUrl : 'views/landingTpl.html'
            })
            .state('main', {
                templateUrl : 'views/mainTpl.html',
                controller: 'mainCtrl'
            })
            .state('main.forms', {
                templateUrl : 'views/formsTpl.html'
                
            })   
                .state('main.forms.cluster', {
                    controller: 'clusterFormCtrl',
                    templateUrl : 'views/clusterFormTpl.html'
                })
                    .state('main.forms.cluster.general', {
                        templateUrl : 'views/clusterFormGeneralStepTpl.html'
                    })
                    .state('main.forms.cluster.summary', {
                        templateUrl : 'views/clusterFormSummaryStepTpl.html'
                    })
                .state('main.forms.feed', {
                    controller: 'feedFormCtrl',
                    templateUrl : 'views/feedFormTpl.html'
                })
                    .state('main.forms.feed.general', {
                        templateUrl : 'views/feedFormGeneralStepTpl.html'
                    })
                    .state('main.forms.feed.properties', {
                        templateUrl : 'views/feedFormPropertiesStepTpl.html'
                    })
                    .state('main.forms.feed.location', {
                        templateUrl : 'views/feedFormLocationStepTpl.html'
                    })
                    .state('main.forms.feed.clusters', {
                        templateUrl : 'views/feedFormClustersStepTpl.html'
                    })
                    .state('main.forms.feed.summary', {
                        templateUrl : 'views/feedFormSummaryStepTpl.html'
                    })

            .state('main.dashboard', {
                templateUrl : 'views/dashboardTpl.html',
                controller: 'dashboardCtrl'
            });        
    }]);
    
})();
