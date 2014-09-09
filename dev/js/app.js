(function () {
    
    var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'app.controllers', 'app.directives', 'app.services']);
            
    app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
            
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
            .state('root', {
                url: '/',
                templateUrl : 'html/homeTpl.html',
                controller  : 'homeCtrl'
            })
            .state('root.upload', {
                templateUrl : 'html/uploadPreviewTpl.html'
            })
            .state('exampleState', {
                url: '/',
                templateUrl : 'html/exampleTpl.html',
                controller  : 'homeCtrl'
            });          
    }]);
    
})();
