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

  describe('Frequency Directive', function () {

    var element, scope, compile;

    beforeEach(module('app.directives'));


    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    }));

    it('Should render 2 hours', function() {
      scope.someFrequency = {unit: 'hours', quantity: 2};
      element = newElement('<frequency value="someFrequency" prefix="at"/>', scope);

      expect(element.text()).toBe('at 2 hours');
    });

    it('Should render "Not specified"', function() {
      scope.someFrequency = {unit: 'hours', quantity: null};
      element = newElement('<frequency value="someFrequency"/>', scope);

      expect(element.text()).toBe('Not specified');
    });


    function newElement(html) {
      var element = compile(html)(scope);
      scope.$digest();
      return element;
    }
  });
})();