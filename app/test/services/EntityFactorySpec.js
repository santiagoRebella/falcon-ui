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

  describe('EntityFactory', function () {
    var factory;

    beforeEach(module('app.services.entity.factory'));

    beforeEach(inject(function(EntityFactory) {
      factory = EntityFactory;
    }));

    describe('newFeed', function() {
      it('Should return a new feed', function() {

        var feed = factory.newFeed();

        expect(feed).toNotBe(null);
        expect(feed).toNotBe(undefined);
      });
    });

    describe('newCluster', function() {
      it('Should return a new cluster', function() {

        var cluster = factory.newCluster('source', true);

        expect(cluster.type).toBe('source');
        expect(cluster.selected).toBe(true);
      });
    });

    describe('deserialize', function() {
      it('Should copy the general information', function() {

        var feedModel = {
          feed: {
            _xmlns: "uri:falcon:feed:0.1",
            _name: 'FeedName',
            _description: 'Feed Description'
          }
        };

        var feed = factory.deserialize(feedModel);


        expect(feed.name).toBe(feedModel.feed._name);
        expect(feed.description).toBe(feedModel.feed._description);

      });

    });

  });
})();