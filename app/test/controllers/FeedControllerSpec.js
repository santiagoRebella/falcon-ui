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
        $timeout: {},
        Falcon: {},
        EntityModel: createEntityMock(),
        $state: {},
        clusters: {}
      });
    }));


    it('Should be initialized properly', function() {
      scope.fileSysSection = false;

      scope.init();

      expect(scope.fileSysSection).toBe(true);
      expect(scope.sourceSection).toBe(true);
      expect(scope.clusterSelectedSection).toBe(0);
      expect(scope.feedEntity).toEqual(createEntityMock().feedModel);
      expect(scope.feedForm.tags).toEqual([{
        key: null,
        value: null
      }]);
    });

    it('Should add a new empty tag', function() {
      expect(scope.feedForm.tags.length).toEqual(1);

      scope.addTag();

      expect(scope.feedForm.tags.length).toEqual(2);
      expect(scope.feedForm.tags[1]).toEqual({key: null, value: null});
    });

    it('Should remove a tag at the specified index', function() {
      scope.feedForm.tags = [
        {key: 'key0', value: 'value0'},
        {key: 'key1', value: 'value1'},
        {key: 'key2', value: 'value2'}
      ];

      scope.removeTag(1);

      expect(scope.feedForm.tags.length).toEqual(2);
      expect(scope.feedForm.tags).toEqual([{key: 'key0', value: 'value0'}, {key: 'key2', value: 'value2'}]);
    });

    it('Should not delete if there is only one element', function() {
      scope.feedForm.tags = [{key: 'key', value: 'value'}];

      scope.removeTag(0);

      expect(scope.feedForm.tags).toEqual([{key: 'key', value: 'value'}]);
    });

    it('Should not delete if index is not passed in', function() {
      scope.feedForm.tags = [
        {key: 'key0', value: 'value0'},
        {key: 'key1', value: 'value1'}
      ];

      scope.removeTag();

      expect(scope.feedForm.tags).toEqual([{key: 'key0', value: 'value0'}, {key: 'key1', value: 'value1'}]);
    });

  });


  function createEntityMock() {
    return {
      feedModel: {
        feed: {
          tags: "",
          groups: "",
          frequency: "",
          timezone: "",
          "late-arrival": {
            "_cut-off": ""
          },
          clusters: [{
            "cluster": {
              validity: {
                _start: "",
                _end: ""
              },
              retention: {
                _limit: "",
                _action: ""
              },
              _name: "",
              _type: "source"
            }
          }],
          locations: {
            location: [{
              _type: "data",
              _path: "/none"
            }, {
              _type: "stats",
              _path: "/none"
            }, {
              _type: "meta",
              _path: "/none"
            }]
          },
          ACL: {
            _owner: "",
            _group: "",
            _permission: ""
          },
          schema: {
            _location: "/none",
            _provider: "none"
          },
          _xmlns: "uri:falcon:feed:0.1",
          _name: "",
          _description: ""
        }
      }
    };
  }

})();