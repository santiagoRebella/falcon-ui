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

    describe('newEntry', function() {
      it('Should return a new cluster', function() {

        var entry = factory.newEntity('SomeKey', 'SomeValue');

        expect(entry.key).toBe('SomeKey');
        expect(entry.value).toBe('SomeValue');
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
        expect(feed.xmlns).toBe(undefined);
      });


    });
    describe('deserialize', function() {
      it('Should copy tags', function() {

        var feedModel = {
          feed: {
            tags: 'owner=USMarketing,classification=Secure'
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.tags[0].key).toBe('owner');
        expect(feed.tags[0].value).toBe('USMarketing');
        expect(feed.tags[1].key).toBe('classification');
        expect(feed.tags[1].value).toBe('Secure');
      });

      it('Should copy groups', function() {

        var feedModel = {
          feed: {
            groups: 'churnAnalysisDataPipeline,Group2,Group3'
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.groups).toBe(feedModel.feed.groups);
      });

      it('Should copy ACL', function() {
        var feedModel = {
          feed: {
            ACL: {_owner: 'ambari-qa', _group: 'users', _permission: '0755' }
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.ACL.owner).toBe(feedModel.feed.ACL._owner);
        expect(feed.ACL.group).toBe(feedModel.feed.ACL._group);
        expect(feed.ACL.permission).toBe(feedModel.feed.ACL._permission);
      });

      it('Should copy Schema', function() {
        var feedModel = {
          feed: {
            schema: {_location: '/location', _provider: 'provider'}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.schema.location).toBe(feedModel.feed.schema._location);
        expect(feed.schema.provider).toBe(feedModel.feed.schema._provider);
      });

      it('Should copy frequency', function() {
        var feedModel = {
          feed: {
            frequency: 'hours(20)'
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.frequency.unit).toBe('hours');
        expect(feed.frequency.quantity).toBe('20');
      });

      it('Should copy late arrival', function() {
        var feedModel = {
          feed: {
            "late-arrival": {"_cut-off": 'days(10)'}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.lateArrival.active).toBe(true);
        expect(feed.lateArrival.cutOff.unit).toBe('days');
        expect(feed.lateArrival.cutOff.quantity).toBe('10');
      });

      it('Should not copy late arrival when is not present', function() {
        var feedModel = {
          feed: {}
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.lateArrival.active).toBe(false);
        expect(feed.lateArrival.cutOff.unit).toBe('hours');
        expect(feed.lateArrival.cutOff.quantity).toBe(null);
      });

      it('Should copy availabilityFlag', function() {
        var feedModel = {
          feed: {
            availabilityFlag: 'Available'
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.availabilityFlag).toBe(feedModel.feed.availabilityFlag);
      });

      it('Should not copy availabilityFlag if not present in the xml', function() {
        var feedModel = {
          feed: {}
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.availabilityFlag).toBe(null);
      });

      it('Should copy custom properties', function() {
        var feedModel = {
          feed: {
            properties: {property: [
              {_name: 'Prop1', _value: 'Value1'},
              {_name: 'Prop2', _value: 'Value2'}
            ]}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.customProperties.length).toBe(3);
        expect(feed.customProperties[1].key).toBe('Prop1');
        expect(feed.customProperties[1].value).toBe('Value1');
        expect(feed.customProperties[2].key).toBe('Prop2');
        expect(feed.customProperties[2].value).toBe('Value2');
      });

      it('Should not copy falcon properties into the custom properties', function() {
        var feedModel = {
          feed: {
            properties: {property: [
              {_name: 'queueName', _value: 'QueueName'},
              {_name: 'Prop1', _value: 'Value1'}
            ]}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.customProperties.length).toBe(2);
        expect(feed.customProperties[0].key).toBe(null);
        expect(feed.customProperties[0].value).toBe(null);
        expect(feed.customProperties[1].key).toBe('Prop1');
        expect(feed.customProperties[1].value).toBe('Value1');
      });

      it('Should copy queueName properties into properties', function() {
        var feedModel = {
          feed: {
            properties: {property: [
              {_name: 'queueName', _value: 'QueueName'},
              {_name: 'Prop1', _value: 'Value1'}
            ]}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.properties.length).toBe(6);
        expect(feed.properties[0].key).toBe('queueName');
        expect(feed.properties[0].value).toBe('QueueName');
      });

      it('Should leave the default properties if no properties appear on the xml and copy the new ones', function() {
        var feedModel = {
          feed: {
            properties: {
              property: [
                {_name: 'jobPriority', _value: 'VERY_LOW'}
              ]
            }
          }
        };


        var feed = factory.deserialize(feedModel);

        expect(feed.properties.length).toBe(6);
        expect(feed.properties[0].key).toBe('queueName');
        expect(feed.properties[0].value).toBe(null);
        expect(feed.properties[1].key).toBe('jobPriority');
        expect(feed.properties[1].value).toBe('VERY_LOW');
      });


      it('Should copy timeout as a Frequency Object', function() {
        var feedModel = {
          feed: {
            properties: {property: [
              {_name: 'queueName', _value: 'QueueName'},
              {_name: 'timeout', _value: 'days(4)'}
            ]}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.properties.length).toBe(6);
        expect(feed.properties[2].key).toBe('timeout');
        expect(feed.properties[2].value.quantity).toBe('4');
        expect(feed.properties[2].value.unit).toBe('days');
      });

      it('Should copy file system locations', function() {
        var feedModel = {
          feed: {
            locations: {location: [
              {_type: 'data', _path: '/none1'},
              {_type: 'stats', _path: '/none2'}
            ]}
          }
        };

        var feed = factory.deserialize(feedModel);
        var locations = feed.storage.fileSystem.locations;

        expect(feed.storage.fileSystem.active).toBe(true);
        expect(locations.length).toBe(2);
        expect(locations[0].type).toBe('data');
        expect(locations[0].path).toBe('/none1');
        expect(locations[1].type).toBe('stats');
        expect(locations[1].path).toBe('/none2');
      });

      it('Should not copy file system locations if they are not defined and keep the defaults', function() {
        var feedModel = {
          feed: {
          }
        };

        var feed = factory.deserialize(feedModel);
        var locations = feed.storage.fileSystem.locations;

        expect(feed.storage.fileSystem.active).toBe(false);
        expect(locations.length).toBe(3);
        expect(locations[0].type).toBe('data');
        expect(locations[0].path).toBe('/');
        expect(locations[1].type).toBe('stats');
        expect(locations[1].path).toBe('/');
        expect(locations[2].type).toBe('meta');
        expect(locations[2].path).toBe('/');
      });

      it('Should set file system active flag as false if there are no locations are', function() {
        var feedModel = {
          feed: {}
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.storage.fileSystem.active).toBe(false);
      });

      it('Should copy catalog uri', function() {
        var feedModel = {
          feed: {
            "table": {
              _uri : 'table:uri'
            }
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.storage.catalog.active).toBe(true);
        expect(feed.storage.catalog.catalogTable.uri).toBe('table:uri');
      });

      it('Should not copy catalog uri if not present', function() {
        var feedModel = {
          feed: {}
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.storage.catalog.active).toBe(false);
        expect(feed.storage.catalog.catalogTable.uri).toBe(null);
      });

      it('Should copy cluster name and type', function() {
        var feedModel = {
          feed: {
            clusters: {
              cluster: [{
                _name: 'ClusterOne',
                _type: 'target'
              }]
            }
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.clusters.length).toBe(1);
        expect(feed.clusters[0].name).toBe('ClusterOne');
        expect(feed.clusters[0].type).toBe('target');
      });

      it('Should copy clusters and select the first source cluster', function() {
        var feedModel = {
          feed: {
            clusters: {
              cluster: [
                {_name: 'ClusterOne', _type: 'target'},
                {_name: 'ClusterTwo', _type: 'source'},
                {_name: 'ClusterThree', _type: 'target'},
                {_name: 'ClusterFour', _type: 'source'}
              ]
            }
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.clusters[0].selected).toBe(false);
        expect(feed.clusters[1].selected).toBe(true);
        expect(feed.clusters[2].selected).toBe(false);
        expect(feed.clusters[3].selected).toBe(false);

      });

      it('Should copy validity', function() {
        var feedModel = {
          feed: {
            clusters: {cluster: [{_name: 'ClusterOne', _type: 'target',
              validity: {
                _start: '2014-02-28T01:20Z',
                _end: '2016-03-31T04:30Z'
              }
            }]}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.clusters[0].validity.start.date).toEqual(newUtcDate(2014, 2, 28));
        expect(feed.clusters[0].validity.start.time).toEqual(newUtcTime(1, 20));
        expect(feed.clusters[0].validity.end.date).toEqual(newUtcDate(2016, 3, 31));
        expect(feed.clusters[0].validity.end.time).toEqual(newUtcTime(4, 30));

      });

      it('Should copy retention', function() {
        var feedModel = {
          feed: {
            clusters: {cluster: [{_name: 'ClusterOne', _type: 'target',
              retention: {
                _limit: 'weeks(4)',
                _action: 'delete'
              }
            }]}
          }
        };

        var feed = factory.deserialize(feedModel);

        expect(feed.clusters[0].retention.quantity).toBe('4');
        expect(feed.clusters[0].retention.unit).toBe('weeks');
        expect(feed.clusters[0].retention.action).toBe('delete');
      });

      it('Should copy clusters locations', function() {
        var feedModel = {
          feed: {
            clusters: {cluster: [{_name: 'ClusterOne', _type: 'target',
              locations: {
                location: [
                  {_type: 'stats', _path: '/path1'},
                  {_type: 'data', _path: '/path2'},
                  {_type: 'tmp', _path: '/path3'}
              ]}
            }]}
          }
        };

        var feed = factory.deserialize(feedModel);
        var locations = feed.clusters[0].storage.fileSystem.locations;

        expect(feed.clusters[0].storage.fileSystem.active).toBe(true);
        expect(locations.length).toBe(3);
        expect(locations[0].type).toBe('stats');
        expect(locations[0].path).toBe('/path1');
        expect(locations[1].type).toBe('data');
        expect(locations[1].path).toBe('/path2');
        expect(locations[2].type).toBe('tmp');
        expect(locations[2].path).toBe('/path3');
      });

      it('filesystem should be inactive if there are no locations', function() {
        var feedModel = {
          feed: {
            clusters: {cluster: [{_name: 'ClusterOne', _type: 'target'}]}
          }
        };

        var feed = factory.deserialize(feedModel);
        var locations = feed.clusters[0].storage.fileSystem.locations;

        expect(feed.clusters[0].storage.fileSystem.active).toBe(false);
        expect(locations.length).toBe(3);
      });

      it('Should copy catalog uri', function() {
        var feedModel = {
          feed: {
            clusters: {cluster: [{_name: 'ClusterOne', _type: 'target',
              "table": {
                _uri : 'table:uri'
              }
            }]}
          }
        };


        var feed = factory.deserialize(feedModel);
        var catalogStorage = feed.clusters[0].storage.catalog;

        expect(catalogStorage.active).toBe(true);
        expect(catalogStorage.catalogTable.uri).toBe('table:uri');
      });

      it('Should set catalog storage as inactive when not present in the xml', function() {
        var feedModel = {
          feed: {
            clusters: {cluster: [{_name: 'ClusterOne', _type: 'target'}]}
          }
        };


        var feed = factory.deserialize(feedModel);
        var catalogStorage = feed.clusters[0].storage.catalog;

        expect(catalogStorage.active).toBe(false);
        expect(catalogStorage.catalogTable.uri).toBe(null);
      });


    });

    function newUtcDate(year, month, day) {
      return new Date(Date.UTC(year, month, day))
    }

    function newUtcTime(hours, minutes) {
      return new Date(Date.UTC(1900, 1, 1, hours, minutes, 0));
    }

  });
})();