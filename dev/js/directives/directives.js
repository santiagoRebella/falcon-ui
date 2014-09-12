(function () {
	
	var app = angular.module('app.directives', []);
	
	app.directive('navHeader', function () {
		return {
			replace:true,
			restrict: 'A',
			templateUrl: 'html/navTpl.html',
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
	
	app.directive('listTable', function() {
        return {
            scope: {
                input: "=",
                edit: "=",
                clone: "=",
                remove: "=",
                relations: "=",
                caption:"@"
            },
            restrict: "EA",
            templateUrl: 'html/tableDv.html',
            link: function (scope, element, attrs) { 
                scope.info = {};
                
                scope.$watch('input', function() {
                    if(scope.input.length < 1) {
                        scope.info.empty = true;
                    }
                    else {
                        scope.info.empty = false;
                    }
                }, true);
                
                
                

            }
        };
    });
	
})();
