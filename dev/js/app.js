(function () {
    
    var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'app.controllers', 'app.directives', 'app.services']);
            
    app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        
        //$httpProvider.defaults.headers.post = {'Content-Type': 'application/xml'};
            
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
            .state('root', {
                url: '/',
                templateUrl : 'html/homeTpl.html',
                controller  : 'homeCtrl'
            })
            .state('root.submitPreview', {
                templateUrl : 'html/submitPreviewTpl.html',
                controller: 'submitPreviewCtrl'
            })
            .state('root.submited', {
                templateUrl : 'html/submitedTpl.html',
                controller: 'submitedCtrl'
            })
            .state('exampleState', {
                url: '/',
                templateUrl : 'html/exampleTpl.html',
                controller  : 'homeCtrl'
            });          
    }]);
    
})();
