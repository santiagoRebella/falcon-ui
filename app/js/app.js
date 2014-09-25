(function () {
    
    var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'app.controllers', 'app.directives', 'app.services']);
            
    app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        
        //$httpProvider.defaults.headers.post = {'Content-Type': 'application/xml'};
            
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
            .state('landing', {
                url: '/',
                templateUrl : 'html/landingTpl.html'
            })
            .state('main', {
                templateUrl : 'html/mainTpl.html',
                controller: 'mainCtrl'
            })
            .state('main.forms', {
                templateUrl : 'html/formsTpl.html'
                
            })   
                .state('main.forms.cluster', {
                    controller: 'clusterFormCtrl',
                    templateUrl : 'html/cluster/clusterFormTpl.html'
                })
                    .state('main.forms.cluster.general', {
                        templateUrl : 'html/cluster/clusterFormGeneralStepTpl.html'
                    })
                    .state('main.forms.cluster.summary', {
                        templateUrl : 'html/cluster/clusterFormSummaryStepTpl.html'
                    })
                .state('main.forms.feed', {
                    controller: 'feedFormCtrl',
                    templateUrl : 'html/feedFormTpl.html'
                })
                    .state('main.forms.feed.general', {
                        templateUrl : 'html/feedFormGeneralStepTpl.html'
                    })
                    .state('main.forms.feed.properties', {
                        templateUrl : 'html/feedFormPropertiesStepTpl.html'
                    })
                    .state('main.forms.feed.location', {
                        templateUrl : 'html/feedFormLocationStepTpl.html'
                    })
                    .state('main.forms.feed.clusters', {
                        templateUrl : 'html/feedFormClustersStepTpl.html'
                    })
                    .state('main.forms.feed.summary', {
                        templateUrl : 'html/feedFormSummaryStepTpl.html'
                    })

            .state('main.dashboard', {
                templateUrl : 'html/dashboardTpl.html',
                controller: 'dashboardCtrl'
            });        
    }]);
    
})();
