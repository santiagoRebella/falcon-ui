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

  describe('EntityService', function () {
    var httpBackendMock;
    var entitiesService;

    beforeEach(module('app.services.entity'));

    beforeEach(inject(function($httpBackend, EntityService) {
      httpBackendMock = $httpBackend;
      entitiesService = EntityService;
    }));

    it('Should return the expected entities', function() {
      var expectedEntities = [{name: 'cluster1'}];
      var entities = [];

      httpBackendMock.expectGET('/api/entities/list/cluster?user.name=dashboard').respond(expectedEntities);

      entitiesService.findByType('cluster').then(function(response) {
        entities = response.data;
      });

      httpBackendMock.flush();
      expect(entities).toEqual(expectedEntities);

    });
  });
})();