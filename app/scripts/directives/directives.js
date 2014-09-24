(function () {
	
	var app = angular.module('app.directives', []);
	
	app.directive('navHeader', function () {
		return {
			replace:false,
			restrict: 'A',
			templateUrl: 'views/navTpl.html',
			controller: 'headerCtrl'
		};
	});
	
	//Angular is not supporting file inputs on change binding that is why this directive
	app.directive('fileinputChange', function() {
	    return {
			restrict: "A",
			link: function (scope, element, attrs) {
	            var onChangeFunc = element.scope()[attrs.fileinputChange];
				element.bind('change', onChangeFunc);
				
			}
	    };
	});
	
	
    app.directive('entitiesList', function() {
        return {
            scope: {
                input: "=",
                play: "=",  
                pause: "=",
                stop:"=",
                clone: "=",
                remove: "=",
                edit: "=",
                caption: "@"
            },
            restrict: "EA",
            templateUrl: 'views/entitiesListDv.html',
            link: function (scope) {
                scope.info = {};
                
                scope.$watch('input', function() {
                    if(scope.input.length < 1) {
                        scope.info.empty = true;
                    }
                    else {
                        scope.info.empty = false;
                        
                    }
                }, true);
                
                if(scope.caption === "Clusters") {
                   scope.action = ""; 
                }
                else {
                   scope.action = 'stopped'; 
                }
                scope.scopePlay = function (type, name) {
                    scope.action = 'running'; 
                    scope.play(type, name);
                };
                scope.scopeStop = function (type, name) {
                    scope.action = 'stopped'; 
                    scope.stop(type, name);
                };
                scope.scopePause = function (type, name) {
                    scope.action = 'paused';
                    scope.pause(type, name);
                };
 
            }
        };
    });
})();
