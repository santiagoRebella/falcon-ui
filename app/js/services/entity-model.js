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
  var module = angular.module('app.services.entity.model', []);

  module.factory('EntityModel', ["X2jsService", function(X2jsService) {

    var EntityModel = {};

    EntityModel.json = null;

    EntityModel.identifyType = function(json) {
      if(json.feed) { EntityModel.type = "feed"; }
      else if(json.cluster) { EntityModel.type = "cluster"; }
      else if(json.process) { EntityModel.type = "process"; }
      else { EntityModel.type = 'Type not recognized'; }
    };

    EntityModel.getJson = function(xmlString) {
      EntityModel.json = X2jsService.xml_str2json( xmlString );
      return EntityModel.identifyType(EntityModel.json);
    };

    EntityModel.clusterModel = {
      cluster:{

        interfaces:{
          interface:[
            {
              _type:"readonly",
              _endpoint:"hftp://",
              _version:""
            },
            {
              _type:"write",
              _endpoint:"hdfs://",
              _version:""
            },
            {
              _type:"execute",
              _endpoint:"",
              _version:""
            },
            {
              _type:"workflow",
              _endpoint:"http://",
              _version:""
            },
            {
              _type:"messaging",
              _endpoint:"tcp://",
              _version:""
            },
            {
              _type:"registry",
              _endpoint:"tbd://",
              _version:""
            }
          ]
        },

        locations:{
          location:[

          ]
        },
        _xmlns:"uri:falcon:cluster:0.1",
        _name:"",
        _description:"",
        _colo:""

      }
    };

    EntityModel.feedModel = {
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
    };

    EntityModel.newFeedModel = function () {
      var feed = EntityModel.feedModel.feed;
      return angular.copy(feed);
    };

    EntityModel.newFeedModelFrom = function (source) {
      var target = EntityModel.newFeedModel();

      copyAttributes(source, target, ['name', 'description'], '_');
      copyAttribute(source, target, 'groups','');
      copyAttributes(source.ACL, target.ACL, ['owner', 'group', 'permission'], '_');
      copyAttributes(source.schema, target.schema, ['location', 'provider'], '_');
      copyAttribute({frequency: frequencyToString(source.frequency) }, target, 'frequency','');
      copyAttribute({"cut-off": frequencyToString(source.lateArrival.cutOff) }, target['late-arrival'], 'cut-off','_');
      copyAttribute({locations: {location: source.locations.map(locationMapping)}}, target, 'locations','');

      return target;
    };

    EntityModel.newTagsStringFrom = function (source) {
      return source.filter(emptyKeys).map(toKeyValuePair).join(', ');
    };

    return EntityModel;

  }]);

  function toKeyValuePair(input) {
    return input.key + '=' + input.value;
  }

  function emptyKeys(input) {
    return input.key;
  }

  function copyAttributes(source, target, fields, prefix) {
    fields.forEach(function(field) {
      copyAttribute(source, target, field, prefix);
    });
  }

  function copyAttribute(source, target, field, prefix) {
    addAttribute(target, field, prefix, source[field]);
  }

  function addAttribute(target, field, prefix, value) {
    target[prefix + field] = value;
  }

  function frequencyToString(input) {
    return input.unit + '(' + input.quantity + ')';
  }

  function locationMapping(input) {
    return {_type : input.type, _path : input.path};
  }

})();