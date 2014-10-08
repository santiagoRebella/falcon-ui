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

    it('Should load a feed from the scope if it is present int the scope', function() {

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

      it('Should add an ACL element even though the properties are empty', function () {
        scope.feed = {name: 'FeedName',
          ACL: {owner: null, group: null, permission: null}
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<ACL/>" +
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

      it('Should add the schema element even though the properties are empty', function () {
        scope.feed = {name: 'FeedName',
          schema: {location: null, provider: null}
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<schema/>" +
          "</feed>"
        );

      });

      it('Should transform frequency properly', function () {
        scope.feed = {name: 'FeedName',
          frequency: {quantity: 4, unit: 'weeks'}
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<frequency>weeks(4)</frequency>" +
          "</feed>"
        );

      });

      it('Should transform late arrival properly when defined', function () {
        scope.feed = {name: 'FeedName',
          lateArrival: {active: true, cutOff: {quantity: 22, unit: 'hours'}}
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<late-arrival cut-off='hours(22)'/>" +
          "</feed>"
        );

      });

      it('Should not transform late arrival properly when quantity is not defined', function () {
        scope.feed = {name: 'FeedName',
          lateArrival: {active: false, cutOff: {quantity: null, unit: 'hours'}}
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'/>"
        );

      });

      it('Should transform availability flag', function () {
        scope.feed = {name: 'FeedName',
          availabilityFlag: 'Available'
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<availabilityFlag>Available</availabilityFlag>" +
          "</feed>"
        );

      });

      it('Should transform timezone', function () {
        scope.feed = {name: 'FeedName',
          timezone: 'GMT+1:00'
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<timezone>GMT+1:00</timezone>" +
          "</feed>"
        );

      });

      it('Should transform queueName, jobPriority and timeout and custom properties', function () {
        scope.feed = {name: 'FeedName',
          properties: [
            {key: 'queueName', value: 'Queue'},
            {key: 'jobPriority', value: 'HIGH'},
            {key: 'timeout', value: {quantity: 7, unit: 'weeks'}}
          ],
          customProperties: [
            {key: 'custom1', value: 'value1'},
            {key: 'custom2', value: 'value2'}
          ]
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<properties>" +
              "<property name='queueName' value='Queue'></property>" +
              "<property name='jobPriority' value='HIGH'></property>" +
              "<property name='timeout' value='weeks(7)'></property>" +
              "<property name='custom1' value='value1'></property>" +
              "<property name='custom2' value='value2'></property>" +
            "</properties>" +
          "</feed>"
        );

      });

      it('Should transform not add queueName nor timeout if they were not defined', function () {
        scope.feed = {name: 'FeedName',
          properties: [
            {key: 'queueName', value: null},
            {key: 'jobPriority', value: 'HIGH'},
            {key: 'timeout', value: {quantity: null, unit: 'weeks'}}
          ]
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<properties>" +
              "<property name='jobPriority' value='HIGH'></property>" +
            "</properties>" +
          "</feed>"
        );

      });

      it('Should transform locations properly if file system storage is active', function () {
        scope.feed = {name: 'FeedName',
          storage: {
            fileSystem: {
              active: true,
              locations: [
                {type: 'data', path: '/none1'},
                {type: 'stats', path: '/none2'},
                {type: 'meta', path: '/none3'}
              ]
            }
          }
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<locations>" +
              "<location type='data' path='/none1'></location>" +
              "<location type='stats' path='/none2'></location>" +
              "<location type='meta' path='/none3'></location>" +
            "</locations>" +
          "</feed>"
        );

      });

      it('Should not transform locations properly if file system storage is not active', function () {
        scope.feed = {name: 'FeedName',
          storage: {
            fileSystem: {
              active: false,
              locations: [
                {type: 'data', path: '/none1'},
                {type: 'stats', path: '/none2'},
                {type: 'meta', path: '/none3'}
              ]
            }
          }
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'/>"
        );

      });

      it('Should transform catalog properly if catalog storage is active', function () {
        scope.feed = {name: 'FeedName',
          storage: {
            catalog: {
              active: true,
              catalogTable: {uri: '/none'}
            }
          }
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<table uri='/none'/>" +
          "</feed>"
        );

      });

      it('Should not transform catalog if catalog storage is not active', function () {
        scope.feed = {name: 'FeedName',
          storage: {
            catalog: {
              active: false,
              catalogTable: {uri: '/none'}
            }
          }
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'/>"
        );

      });

      it('Should transform clusters', function () {
        scope.feed = {name: 'FeedName',
          storage: {
            fileSystem: {active: true, locations: [
              {type: 'data', path: '/masterpath'}
            ]},
            catalog: {active: true, catalogTable: {uri: '/masteruri'}}
          },
          clusters: [
            {
              name: 'primaryCluster',
              type: 'source',
              validity: {start: {date: '2014-02-28', time: '00:00'}, end: {date: '2016-03-31', time: '00:00'}},
              retention: {quantity: 2, unit: 'hours', action: 'delete'},
              storage: {
                fileSystem: {
                  active: true,
                  locations: [
                    {type: 'data', path: '/none1'},
                    {type: 'stats', path: '/none2'},
                    {type: 'meta', path: '/none3'}
                  ]
                },
                catalog: {
                  active: false,
                  catalogTable: {uri: '/primaryuri'}
                }
              }
            },
            {
              name: 'secondaryCluster',
              type: 'target',
              validity: {start: {date: '2015-02-28', time: '00:00'}, end: {date: '2017-03-31', time: '00:00'}},
              retention: {quantity: 5, unit: 'weeks', action: 'archive'},
              storage: {
                fileSystem: {
                  active: true,
                  locations: [
                    {type: 'data', path: '/none4'},
                    {type: 'stats', path: '/none5'},
                    {type: 'meta', path: '/none6'}
                  ]
                },
                catalog: {
                  active: true,
                  catalogTable: {uri: '/secondaryuri'}
                }
              }
            }
          ]
        };

        var xml = scope.transform();

        expect(xml).toBe(
          "<feed xmlns='uri:falcon:feed:0.1' name='FeedName'>" +
            "<clusters>" +
              "<cluster name='primaryCluster' type='source'>" +
                "<validity start='2014-02-28T00:00Z' end='2016-03-31T00:00Z'/>" +
                "<retention limit='hours(2)' action='delete'/>" +
                "<locations>" +
                  "<location type='data' path='/none1'></location>" +
                  "<location type='stats' path='/none2'></location>" +
                  "<location type='meta' path='/none3'></location>" +
                "</locations>" +
                "<table uri='/primaryuri'/>" +
              "</cluster>" +
              "<cluster name='secondaryCluster' type='target'>" +
                "<validity start='2015-02-28T00:00Z' end='2017-03-31T00:00Z'/>" +
                "<retention limit='weeks(5)' action='archive'/>" +
                "<locations>" +
                  "<location type='data' path='/none4'></location>" +
                  "<location type='stats' path='/none5'></location>" +
                  "<location type='meta' path='/none6'></location>" +
                "</locations>" +
                "<table uri='/secondaryuri'/>" +
              "</cluster>" +
            "</clusters>" +
            "<locations>" +
              "<location type='data' path='/masterpath'></location>" +
            "</locations>" +
            "<table uri='/masteruri'/>" +
          "</feed>"
        );

      });

    });

  });

})();