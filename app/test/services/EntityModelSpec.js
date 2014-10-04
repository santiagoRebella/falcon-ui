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

  describe('EntityModel', function () {

    var EntityModel, httpBackend, X2jsServiceMock;

    beforeEach(module('app.services.entity.model', function($provide) {
      X2jsServiceMock = jasmine.createSpyObj('X2jsService', ['xml_str2json']);
      $provide.value('X2jsService', X2jsServiceMock);
    }));

    beforeEach(inject(function($httpBackend, _EntityModel_) {
      EntityModel = _EntityModel_;
      httpBackend = $httpBackend;
    }));


    it('Should set type as not recognized if the entity is not feed, cluster or process', function() {
      EntityModel.identifyType({});

      expect(EntityModel.type).toBe('Type not recognized');
    });

    it('Should create a new feed form with empty attributes', function() {
      var feedForm = EntityModel.newFeedForm();

      expect(feedForm.name).toEqual(null);
      expect(feedForm.description).toEqual(null);
      expect(feedForm.groups).toEqual(null);
      expect(feedForm.tags).toEqual([{key: null, value: null}]);
      expect(feedForm.ACL).toEqual({owner: null, group: null, permission: '*'});
      expect(feedForm.schema).toEqual({location: null, provider: null});
    });

    it('Should contain the proper Feed Model', function() {
      var feed = EntityModel.feedModel.feed;

      expect(feed).toNotBe(null);
      expect(feed._name).toEqual("");
    });

    describe('newFeedModel creates a new empty feed ', function() {
      it('Should return a new feed model', function () {
        var feedModel1 = EntityModel.newFeedModel();
        var feedModel2 = EntityModel.newFeedModel();

        expect(feedModel1).toNotBe(feedModel2);
      });
    });


    describe('newFeedModelFrom creates a new feed model from the json model used in the feed form',
      function() {

      it('Should copy name, description, groups, schema and add the namespace', function() {

        var feedModel = EntityModel.newFeedModelFrom({
          name: 'FeedName',
          description: 'Feed Description',
          groups: 'group1,group2,group3',
          ACL: {owner: 'owner', group: 'group', permission: '777'},
          schema: {location: '/location', provider: 'provider'},
          frequency: {quantity: '2', unit: 'hours'},
          lateArrival: {active: true, cutOff: {quantity: 3, unit: 'weeks'}},
          locations: [{type: 'data', path: '/', focused: false}]
        });


        expect(feedModel._xmlns).toEqual('uri:falcon:feed:0.1');
        expect(feedModel._name).toEqual('FeedName');
        expect(feedModel._description).toEqual('Feed Description');

        expect(feedModel.groups).toEqual('group1,group2,group3');
        expect(feedModel.ACL).toEqual({_owner: 'owner', _group: 'group', _permission: '777'});
        expect(feedModel.schema).toEqual({_location: '/location', _provider: 'provider'});

        expect(feedModel.frequency).toEqual('hours(2)');
        expect(feedModel.locations).toEqual({location : [{_type: 'data', _path: '/'}]});


      });

        it('Should transform the tags into a key value pair string', function() {

          var tagsString = EntityModel.newTagsStringFrom([
            {key: 'key1', value: 'value1'},
            {key: null, value: null},
            {},
            {key: 'key2', value: 'value2'}
          ]);

          expect(tagsString).toBe('key1=value1, key2=value2');

        });

        it('Should transform the tags into a key value pair string', function() {

          var tagsString = EntityModel.newTagsStringFrom([
            {key: 'key1', value: 'value1'},
            {key: null, value: null},
            {},
            {key: 'key2', value: 'value2'}
          ]);

          expect(tagsString).toBe('key1=value1, key2=value2');

        });


    });

  });
})();