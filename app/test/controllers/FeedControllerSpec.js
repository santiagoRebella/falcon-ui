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
    var entityModelServiceMock;

    beforeEach(module('app.controllers.feed'));

    beforeEach(inject(function($q, $rootScope, $controller) {
      scope = $rootScope.$new();
      entityModelServiceMock = jasmine.createSpyObj('EntityModel', ['newFeedModel']);
      var x2js = new X2JS();

      controller = $controller('FeedController', {
        $scope: scope,
        $state: {
          $current:{
            name: 'main.forms.feed.general'
          }
        },
        Falcon: {},
        EntityModel: entityModelServiceMock,
        X2jsService: {
          json2xml_str: function (jsonObj) {
            return x2js.json2xml_str( jsonObj );
          }
        }
      });
    }));



    it('Should be initialized properly', function() {
      scope.init();

      expect(scope.feed.name).toBe(null);
      expect(scope.feed.description).toBe(null);
      expect(scope.feed.groups).toBe(null);
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

    describe('transforming a form json into xml', function() {

      it('Should transform the basic properties', function () {
        scope.feed = {
          name: 'FeedName',
          description: 'Feed Description',
          groups: 'a,b,c'
        };

        var xml = scope.transform();
        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName' description='Feed Description'>" +
            "<groups>a,b,c</groups>" +
          "</feed>"
        );

      });

      it('Should transform tags properly', function () {
        scope.feed = {name: 'FeedName',
          tags: [{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value2'}, {key: null, value: 'value3'}]
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<tags>key1=value1,key2=value2</tags>" +
          "</feed>"
        );

      });

      it('Should transform ACL properly', function () {
        scope.feed = {name: 'FeedName',
          ACL: {owner: 'ambari-qa', group: 'users', permission: '0755'}
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<ACL owner='ambari-qa' group='users' permission='0755'/>" +
          "</feed>"
        );

      });

      it('Should transform schema properly', function () {
        scope.feed = {name: 'FeedName',
          schema: {location: '/location', provider: 'none'}
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<schema location='/location' provider='none'/>" +
          "</feed>"
        );

      });
    });

  });

})();