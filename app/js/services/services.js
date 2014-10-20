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
  var app = angular.module('app.services', []);

  app.factory('Falcon', ["$http", function ($http) {

    var Falcon = {
        serverResponse: null,
        success: null
      },
      USER_ID = 'ambari-qa';

    function add_user(url) {
      var paramSeparator = (url.indexOf('?') !== -1) ? '&' : '?';
      return url + paramSeparator + 'user.name=' + USER_ID;
    }


    Falcon.getServerVersion = function () {
      return $http.get(add_user('/api/admin/version'));
    };
    Falcon.getServerStack = function () {
      return $http.get(add_user('/api/admin/stack'));
    };
    Falcon.postValidateEntity = function (xml, type) {
      return $http.post(add_user('/api/entities/validate/' + type), xml, { headers: {'Content-Type': 'text/plain'} });
    };
    Falcon.postSubmitEntity = function (xml, type) {
      return $http.post(add_user('/api/entities/submit/' + type), xml, { headers: {'Content-Type': 'text/plain'} });
    };
    Falcon.postUpdateEntity = function (xml, type, name) {
      return $http.post(add_user('/api/entities/update/' + type + '/' + name), xml, { headers: {'Content-Type': 'text/plain'} });
    };

    Falcon.postScheduleEntity = function (type, name) {
      return $http.post(add_user('/api/entities/schedule/' + type + '/' + name));
    };
    Falcon.postSuspendEntity = function (type, name) {
      return $http.post(add_user('/api/entities/suspend/' + type + '/' + name));
    };
    Falcon.postResumeEntity = function (type, name) {
      return $http.post(add_user('/api/entities/resume/' + type + '/' + name));
    };

    Falcon.deleteEntity = function (type, name) {
      return $http.delete(add_user('api/entities/delete/' + type + '/' + name));
    };
    Falcon.getEntities = function (type) {
      return $http.get(add_user('/api/entities/list/' + type + '?fields=status,tags'));
    };

    Falcon.getEntityDefinition = function (type, name) {
      return $http.get(add_user('api/entities/definition/' + type + '/' + name));
    };


    //----------------------------------------------//
    return Falcon;

  }]);


  app.factory('FileApi', ["$http", "$q", "EntityModel", function ($http, $q, EntityModel) {

    var FileApi = {};

    FileApi.supported = (window.File && window.FileReader && window.FileList && window.Blob);
    FileApi.errorMessage = 'The File APIs are not fully supported in this browser.';

    FileApi.fileDetails = "No file loaded";
    FileApi.fileRaw = "No file loaded";

    FileApi.loadFile = function (evt) {

      if (FileApi.supported) {
        var deferred = $q.defer(),
          reader = new FileReader(),
          file = evt.target.files[0];

        reader.onload = (function (theFile) {

          reader.readAsText(theFile, "UTF-8");

          return function (e) {
            FileApi.fileRaw = e.target.result;
            FileApi.fileDetails = theFile;
            EntityModel.getJson(FileApi.fileRaw);
            deferred.resolve();
          };

        })(file);

        return deferred.promise;
      }
      else {
        alert(FileApi.errorMessage);
      }
    };
    return FileApi;
  }]);

})();
