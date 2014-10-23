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

  describe('Entity Summary Directive', function () {

    var scope, compile, controller;

    beforeEach(module('app.directives.entity'));


    beforeEach(inject(function($rootScope, $compile, $controller) {
      scope = $rootScope.$new();
      compile = $compile;
      scope.entities = [{"one":1}, {"two": 2}];
      controller = $controller('EntitySummaryCtrl', {
        $scope: scope
        
      });
    }));

    describe('EntitySummaryCtrl', function() {
    
      it('Should statusCount be initialized', function() {

        expect(scope.entities).toEqual( 
          [{"one":1}, {"two": 2}] 
        );

      });

    });

  });
})();