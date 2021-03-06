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
    EntityModel.detailsPageModel = null;

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
        properties: {
          property: []
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

    return EntityModel;

  }]);

})();