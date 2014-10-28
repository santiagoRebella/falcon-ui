/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

	var app = angular.module('app.directives', ['app.services']);
	
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

  app.controller('EntitiesListCtrl', ['$scope', 'Falcon', 'X2jsService', function($scope, Falcon, X2jsService) {
    $scope.downloadEntity = function(type, name) {
      Falcon.getEntityDefinition(type, name)
        .success(function (data) {
        })
        .error(function (err) {
          var error = X2jsService.xml_str2json(err);
          Falcon.success = false;
          Falcon.serverResponse = error.result;
        });
    };
  }]);
	
  app.directive('entitiesList', function() {
    return {
      scope: {
        input: "=",
        schedule: "=",  
        suspend: "=",
        stop:"=",
        clone: "=",
        remove: "=",
        edit: "=",
        type: "@",
        entityDetails:"=",
        resume:"="
      },
      controller: 'EntitiesListCtrl',
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

        scope.selectedRows = [];
        scope.simpleFilter = {};
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
        scope.goEntityDetails = function(name, type) {
          scope.entityDetails(name, type);
        };
            
        
        scope.scopeSchedule = function () {
          var i;
          for(i = 0; i < scope.selectedRows.length; i++) {
            scope.schedule(scope.selectedRows[i].type, scope.selectedRows[i].name);
          }
        };
        scope.scopeStop = function () {
          var i;
          for(i = 0; i < scope.selectedRows.length; i++) {
            scope.stop(scope.selectedRows[i].type, scope.selectedRows[i].name);
          }
        };
        scope.scopeSuspend = function () {
          var i;
          for(i = 0; i < scope.selectedRows.length; i++) {
            scope.suspend(scope.selectedRows[i].type, scope.selectedRows[i].name);
          }
        };
        scope.scopeResume = function () {
          var i;
          for(i = 0; i < scope.selectedRows.length; i++) {
            scope.resume(scope.selectedRows[i].type, scope.selectedRows[i].name);
          }
        };

        scope.download = function() {
          var i;
          for(i = 0; i < scope.selectedRows.length; i++) {
            scope.downloadEntity(scope.selectedRows[i].type, scope.selectedRows[i].name);
          }
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
      restrict: 'E',
      replace: false,
      scope: {
        ngModel: '='
      },
      templateUrl: 'html/directives/timeZoneSelectDv.html'
    };
  });
    
})();
