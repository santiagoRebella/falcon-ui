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
      controller = $controller('EntitySummaryCtrl', {
        $scope: scope
      });
    }));

    describe('EntitySummaryCtrl', function() {
      it('Should be initialized with empty groups', function() {
        scope.init();

        expect(scope.groups).toEqual([]);
      });


      it('Should create the expected metric groups', function() {
        scope.groups = [];
        scope.satusfield = '_status';
        scope.entities = [
            {_name: 'FeedOne', _status: 'STOPPED'},
            {_name: 'FeedTwo', _status: 'RUNNING'},
            {_name: 'FeedThree', _status: 'RUNNING'},
            {_name: 'FeedFour', _status: 'STOPPED'},
            {_name: 'FeedFour', _status: 'OTHER'}
          ];
        scope.statuses = ['RUNNING', 'PAUSED', 'STOPPED']

        scope.group();

        expect(scope.groups.totals).toEqual(
          {
            name: 'totals',
            metrics: [{ key: 'SUBMITTED', value: 5}],
            SUBMITTED: {key: 'SUBMITTED', value: 5}
          }
        );

        expect(scope.groups.partials).toEqual(
        {
          name: 'partials',
          metrics: [
            { key: 'RUNNING', value: 2},
            { key: 'PAUSED', value: 0},
            { key: 'STOPPED', value: 2}
          ]
        }
        );

      });


    });

  });
})();