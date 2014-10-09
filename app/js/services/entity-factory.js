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
  var module = angular.module('app.services.entity.factory', ['app.services.entity.transformer']);

  module.factory('EntityFactory', ['EntityTransformerFactory', function(EntityTransformerFactory) {
    return {
      newFeed: function() {
        return new Feed();
      },

      newCluster: function(type, selected) {
        return new Cluster(type, selected);
      },

      newEntity: function(key, value) {
        return new Entry(key, value);
      },

      transform: function(feed) {
        return transformFeed(feed, EntityTransformerFactory);
      },

      deserialize: function(feedModel) {
        return deserializeFeed(feedModel, EntityTransformerFactory);
      }

    };
  }]);

  function Feed() {
    this.name = null;
    this.description = null;
    this.groups = null;
    this.tags = [new Entry(null, null)];
    this.ACL = new ACL();
    this.schema = new Schema();
    this.frequency = new Frequency(null, 'hours');
    this.lateArrival = new LateArrival();
    this.availabilityFlag = null;
    this.properties = feedProperties();
    this.customProperties = [new Entry(null, null)];
    this.storage = new Storage();
    this.clusters = [new Cluster('source', true)];
    this.timezone = null;
  }


  function ACL() {
    this.owner = null;
    this.group = null;
    this.permission = '*';
  }

  function Schema() {
    this.location = null;
    this.provider = null;
  }

  function feedProperties() {
    return [
      new Entry('queueName', null),
      new Entry('jobPriority', 'NORMAL'),
      new Entry('timeout', new Frequency(null, 'hours')),
      new Entry('parallel', null),
      new Entry('maxMaps', null),
      new Entry('mapBandwidthKB', null)
    ];
  }

  function LateArrival() {
    this.active = false;
    this.cutOff = new Frequency(null, 'hours');
  }

  function Frequency(quantity, unit) {
    this.quantity = quantity;
    this.unit = unit;
  }

  function Entry(key, value) {
    this.key = key;
    this.value = value;
  }

  function Storage() {
    this.fileSystem = new FileSystem();
    this.catalog = new Catalog();
  }

  function Catalog() {
    this.active = false;
    this.catalogTable = new CatalogTable();
  }

  function CatalogTable() {
    this.uri = null;
    this.focused = false;
  }

  function FileSystem() {
    this.active = true;
    this.locations = [new Location('data','/'), new Location('stats','/'), new Location('meta','/')];
  }

  function Location(type, path) {
    this.type = type;
    this.path= path;
    this.focused = false;
  }

  function Cluster(type, selected) {
    this.name = null;
    this.type = type;
    this.selected = selected;
    this.retention = new Frequency(null, 'hours');
    this.retention.action = null;
    this.validity = new Validity();
    this.storage = new Storage();
  }


  function Validity() {
    this.start = new DateAndTime();
    this.end = new DateAndTime();
    this.timezone = null;
  }

  function DateAndTime() {
    this.date = new Date();
    this.time = '00:00';
    this.opened = false;
  }

  function keyValuePairs(input) {
    return input.filter(emptyKey).map(entryToString).join(',');
  }

  function emptyKey (input) {
    return input.key;
  }

  function emptyValue (input) {
    return input && input.value;
  }

  function emptyFrequency (input) {
    return input.value.unit ? input.value.quantity : input.value;
  }

  function entryToString(input) {
    return input.key + '=' + input.value;
  }

  function frequencyToString(input) {
    return input.quantity ? input.unit + '(' + input.quantity + ')' : null;
  }

  function timeAndDateToString(input) {
    return input.date + 'T'  + input.time + 'Z';
  }

  function emptyElement() {return {};}

  function FeedModel() {
    this.feed = {_xmlns: "uri:falcon:feed:0.1"};
  }

  function transformFeed (feed, transformerFactory) {
    var propertyTransform = transformerFactory
      .transform('key', '_name')
      .transform('value', '_value', function(value) {
        return value.quantity ? frequencyToString(value) : value;
      });

    var locationTransform = transformerFactory
      .transform('type', '_type')
      .transform('path', '_path');

    var clusterTransform = transformerFactory
      .transform('name', '_name')
      .transform('type', '_type')
      .transform('validity.start', 'validity._start', timeAndDateToString)
      .transform('validity.end', 'validity._end', timeAndDateToString)
      .transform('retention', 'retention._limit', frequencyToString)
      .transform('retention.action', 'retention._action')
      .transform('storage.fileSystem', 'locations.location', function(fileSystem) {
        return feed.storage.fileSystem.active ? transformfileSystem(fileSystem) : null;
      })
      .transform('storage.catalog', 'table', function(catalog) {
        return feed.storage.catalog.active ? transformCatalog(catalog) : null;
      });

    var transform = transformerFactory
      .transform('name', 'feed._name')
      .transform('description', 'feed._description')
      .transform('tags', 'feed.tags', keyValuePairs)
      .transform('groups', 'feed.groups')
      .transform('availabilityFlag', 'feed.availabilityFlag')
      .transform('frequency', 'feed.frequency', frequencyToString)
      .transform('timezone', 'feed.timezone')
      .transform('lateArrival.cutOff', 'feed.late-arrival._cut-off', frequencyToString)
      .transform('clusters', 'feed.clusters.cluster', function(clusters) {
        return clusters.map(function(cluster) {
          return clusterTransform.apply(cluster, {});
        });
      })
      .transform('storage.fileSystem', 'feed.locations.location', function(fileSystem) {
        return fileSystem.active ? transformfileSystem(fileSystem) : null;
      })
      .transform('storage.catalog', 'feed.table', function(catalog) {
        return catalog.active ? transformCatalog(catalog) : null;
      })
      .transform('ACL', 'feed.ACL', emptyElement)
      .transform('ACL.owner', 'feed.ACL._owner')
      .transform('ACL.group', 'feed.ACL._group')
      .transform('ACL.permission', 'feed.ACL._permission')
      .transform('schema', 'feed.schema', emptyElement)
      .transform('schema.location', 'feed.schema._location')
      .transform('schema.provider', 'feed.schema._provider')
      .transform('allproperties', 'feed.properties.property', function(properties) {
        return properties.filter(emptyValue).filter(emptyFrequency).map(function(property) {
          return propertyTransform.apply(property, {});
        });
      });

    function transformfileSystem (fileSystem) {
      return fileSystem.locations.map(function(location) {
        return locationTransform.apply(location, {});
      });
    }

    function transformCatalog(catalog) {
      return {_uri : catalog.catalogTable.uri};
    }

    return transform.apply(feed, new FeedModel());

  }

  function deserializeFeed(feedModel, transformerFactory) {
    var feed = new Feed();
    feed.storage.fileSystem.active = false;

    var transform = transformerFactory
      .transform('_name', 'name')
      .transform('_description', 'description')
      .transform('tags', 'tags', parseKeyValuePairs)
      .transform('groups','groups')
      .transform('ACL._owner','ACL.owner')
      .transform('ACL._group','ACL.group')
      .transform('ACL._permission','ACL.permission')
      .transform('schema._location','schema.location')
      .transform('schema._provider','schema.provider')
      .transform('frequency','frequency', parseFrequency)
      .transform('late-arrival','lateArrival.active', parseBoolean)
      .transform('late-arrival._cut-off','lateArrival.cutOff', parseFrequency)
      .transform('availabilityFlag', 'availabilityFlag')
      .transform('properties.property', 'customProperties', parseProperties(isCustomProperty))
      .transform('properties.property', 'properties', parseProperties(isFalconProperty))
      .transform('locations', 'storage.fileSystem.active', parseBoolean)
      .transform('locations.location', 'storage.fileSystem.locations', parseLocations)
      ;

    return transform.apply(angular.copy(feedModel.feed), feed);
  }

  function parseKeyValue(keyValue) {
    var parsedPair = keyValue.split('=');
    return new Entry(parsedPair[0], parsedPair[1]);
  }

  function parseKeyValuePairs(tagsString) {
    return tagsString.split(',').map(parseKeyValue);
  }

  function parseFrequency(frequencyString) {
    var parsedFrequency = frequencyString.split('(');
    return new Frequency(parsedFrequency[1].split(')')[0], parsedFrequency[0]);
  }

  function parseBoolean(input) {
    return input !== undefined && input !== null;
  }

  function parseProperty(property) {
    var value = property._name !== 'timeout' ? property._value : parseFrequency(property._value);
    return new Entry(property._name, value);
  }


  function parseProperties(filterFunction) {
    return function(properties) {
      return properties.filter(filterFunction).map(parseProperty);
    };
  }

  function parseLocations(locations) {
    return locations.map(parseLocation);
  }

  function parseLocation(location) {
    return new Location(location._type, location._path);
  }

  var falconProperties = {
    queueName: true,
    jobPriority: true,
    timeout: true,
    parallel: true,
    maxMaps: true,
    mapBandwidthKB: true
  };

  function isCustomProperty(property) {
    return !isFalconProperty(property);
  }

  function isFalconProperty(property) {
    return falconProperties[property._name];
  }

})();