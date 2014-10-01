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
  var scope;
  var controller;

  describe('FeedController', function () {
    beforeEach(module('app.controllers.feed'));

    beforeEach(inject(function($q, $rootScope, $controller) {
      scope = $rootScope.$new();

      controller = $controller('FeedController', {
        $scope: scope,
        $state: {
          $current:{
            name: 'main.forms.feed.general'
          }
        }
      });
    }));



    it('Should be initialized properly', function() {
      scope.init();

      expect(scope.feed.name).toBe(null);
      expect(scope.feed.description).toBe(null);
      expect(scope.feed.groups).toBe(null);
      expect(scope.feed.tags).toEqual([{key: null, value: null}]);
      expect(scope.feed.ACL).toEqual({ owner: null, group: null, permission: '*'});
      expect(scope.feed.schema.location).toBe('/');
      expect(scope.feed.schema.provider).toBe(null);
      expect(scope.feed.frequency).toEqual({quantity: null, unit: 'hours'});
      expect(scope.feed.lateArrival).toEqual({active: false, cutOff: {quantity: null, unit: 'hours'}});
      expect(scope.feed.availabilityFlag).toEqual(false);
      expect(scope.feed.properties).toEqual({
        queueName: null,
        jobPriority: 'NORMAL',
        timeout: {quantity: null, unit: 'hours'},
        parallel: null,
        maxMaps: null,
        mapBandwidthKB: null
      });
      expect(scope.feed.customProperties).toEqual([{key: null, value: null}]);
      expect(scope.feed.storage).toEqual({
        fileSystem: {
          active: true,
          locations: [
            {type: 'data', path: '/', focused: false},
            {type: 'stats', path: '/', focused: false},
            {type: 'meta', path: '/', focused: false}
          ]
        },
        catalog: {
          active: false,
          catalogTable: {
            uri: null,
            focused: false
          }
        }
      });
      expect(scope.feed.clusters).toEqual([{
        name: null,
        type: 'source',
        selected: true,
        retention: {action: null, quantity: null, unit: 'hours'}
      }]);
    });

    it('Should have default validations definitions', function() {
      scope.init();
      var validations = scope.validations;

      expect(validations.id).toEqual({
        pattern: /^(([a-zA-Z]([\\-a-zA-Z0-9])*){1,39})$/,
        maxlength: 39,
        minlength: 0,
        required: true
      });

      expect(validations.freeText).toEqual({
        pattern: /^([\sa-zA-Z0-9]){1,40}$/,
        maxlength: 1000,
        minlength: 0,
        required: false
      });

    });

    it('Should return true when the current state is the general view', function() {
      expect(scope.isActive('main.forms.feed.general')).toBe(true);
    });

    it('Should return true when the current state is not the general view', function() {
      expect(scope.isActive('main.forms.feed.location')).toBe(false);
    });


    it('Should capitalize properly', function() {
      expect(scope.capitalize('hello')).toBe('Hello');
    });

    it('TODO', function() {
      scope.saveEntity();
    });



  });

})();