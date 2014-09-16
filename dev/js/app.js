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
                templateUrl : 'html/formsTpl.html',
                controller: 'formCtrl'
            })   
            .state('main.forms.cluster', {
                templateUrl : 'html/clusterFormTpl.html'
            })
            .state('main.dashboard', {
                templateUrl : 'html/dashboardTpl.html',
                controller: 'dashboardCtrl'
            });        
    }]);
    
})();
