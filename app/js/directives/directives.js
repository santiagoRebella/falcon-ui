(function () {
	
	var app = angular.module('app.directives', []);
	
	app.directive('navHeader', function () {
		return {
			replace:false,
			restrict: 'A',
			templateUrl: 'html/directives/navDv.html',
			controller: 'HeaderController'
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
        type: "@"
      },
      restrict: "EA",
      templateUrl: 'html/directives/entitiesListDv.html',
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
        
        if(scope.type === "cluster") {
          scope.action = ""; 
        }
        else {
          scope.action = 'stopped'; 
        }
        
        scope.selectedRows = [];
        
        scope.scopeRemove = function () {
          var i;
          for(i = 0; i < scope.selectedRows.length; i++) {
            scope.remove(scope.selectedRows[i].type, scope.selectedRows[i].name);
          }
        };
        
        scope.scopeEdit = function () {
          scope.edit(scope.selectedRows[0].type, scope.selectedRows[0].name);       
        };
        scope.scopeClone = function () {
          scope.clone(scope.selectedRows[0].type, scope.selectedRows[0].name);        
        };
        
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

    app.directive('frequency', function() {
      return {
        replace: false,
        scope: {
          value: "=",
          prefix: "@"
        },
        restrict: 'E',
        template: '{{output}}',
        link: function(scope) {
          if(scope.value.quantity) {
            scope.output = scope.prefix + ' ' + scope.value.quantity + ' ' + scope.value.unit;
          } else {
            scope.output = 'Not specified';
          }
        }
      };
    });
    
    app.directive('timeZoneSelect', function() {
      return {
        replace: true,
        restrict: 'E',
        templateUrl: 'html/directives/timeZoneSelectDv.html'
      };
    });
    
})();
