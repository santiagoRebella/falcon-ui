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

  var app = angular.module('app.controllers', ['app.services']);


  app.controller('RootCtrl', [ "$scope", "$timeout", "Falcon", "FileApi", "EntityModel", "$state", "X2jsService", "ValidationService",
    function ($scope, $timeout, Falcon, FileApi, EntityModel, $state, X2jsService, validationService) {

      $scope.validations = validationService.define();
      $scope.models = {};
      $scope.handleFile = function (evt) {
        FileApi.loadFile(evt).then(function () {
          Falcon.postSubmitEntity(FileApi.fileRaw, EntityModel.type).success(function (response) {
            Falcon.success = true;
            Falcon.serverResponse = response;
            $state.go('main');
            $timeout(function () {
              Falcon.serverResponse = { serverResponse: null, success: null };
            }, 5000);

          }).error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
            $state.go('main');
          });
        });
      };

    }]);

  app.controller('DashboardCtrl', [ "$scope", "Falcon", "EntityModel", "FileApi", "$state", "X2jsService", "$window",
    function ($scope, Falcon, EntityModel, FileApi, $state, X2jsService, $window) {
      $scope.serverResponse = Falcon.serverResponse;
      $scope.$watch(function () {
        return Falcon.serverResponse;
      }, function () {
        $scope.serverResponse = Falcon.serverResponse;
        $scope.success = Falcon.success;
        refreshLists();
      }, true);


      $scope.lists = {};
      $scope.lists.feedList = [];
      $scope.lists.clusterList = [];
      $scope.lists.processList = [];

      function refreshLists() {
        $scope.lists.feedList = [];
        $scope.lists.clusterList = [];
        $scope.lists.processList = [];
        Falcon.getEntities("feed")
          .success(function (data) {
            var typeOfData = Object.prototype.toString.call(data.entity);
            if (data === "null") {
              $scope.lists.feedList = [];
            }
            else if (typeOfData === "[object Array]") {
              $scope.lists.feedList = data.entity;
            }
            else if (typeOfData === "[object Object]") {
              $scope.lists.feedList[0] = data.entity;
            }
            else {
              console.log("type of data not recognized");
            }

          })
          .error(function (err) {
            console.log(err);
          });

        Falcon.getEntities("cluster")
          .success(function (data) {
            var typeOfData = Object.prototype.toString.call(data.entity);
            if (data === "null") {
              $scope.lists.clusterList = [];
            }
            else if (typeOfData === "[object Array]") {
              $scope.lists.clusterList = data.entity;
            }
            else if (typeOfData === "[object Object]") {
              $scope.lists.clusterList[0] = data.entity;
            }
            else {
              console.log("type of data not recognized");
            }
          })
          .error(function (err) {
            console.log(err);
          });

        Falcon.getEntities("process")
          .success(function (data) {
            var typeOfData = Object.prototype.toString.call(data.entity);
            if (data === "null") {
              $scope.lists.processList = [];
            }
            else if (typeOfData === "[object Array]") {
              $scope.lists.processList = data.entity;
            }
            else if (typeOfData === "[object Object]") {
              $scope.lists.processList[0] = data.entity;
            }
            else {
              console.log("type of data not recognized");
            }
          })
          .error(function (err) {
            console.log(err);
          });
      }

      refreshLists();

      $scope.deleteEntity = function (type, name) {
        Falcon.deleteEntity(type, name)
          .success(function (data) {
            Falcon.success = true;
            Falcon.serverResponse = data;
          })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;

          });
      };
      $scope.cloneEntity = function (type, name) {
        Falcon.getEntityDefinition(type, name)
          .success(function (data) {
            var modelName = type + "Model";
            var entityModel = X2jsService.xml_str2json(data);
            EntityModel[modelName] = entityModel;
            $scope.models[modelName] = angular.copy(entityModel);
            $scope.cloningMode = true;
            $state.go('forms.' + type + ".general");
          })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
          });
      };
      $scope.editEntity = function (type, name) {

        Falcon.getEntityDefinition(type, name)
          .success(function (data) {
            var entityModel = X2jsService.xml_str2json(data);
            var modelName = type + "Model";
            EntityModel[modelName] = entityModel;
            $scope.models[modelName] = angular.copy(entityModel);
            $scope.editingMode = true;
            $state.go('forms.' + type + ".general");
          })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
          });
      };
      //-----------------------------------------//
      $scope.entityDetails = function (name, type) {
        //window.location.href = 'http://yourExternalSite.com/404.html';'
        $window.location.href = "falcon/entity.html?type=" + type + "&id=" + name;
        /*Falcon.getEntityDefinition(type, name)
          .success(function (data) {
            var entityModel = X2jsService.xml_str2json(data);
            EntityModel.detailsPageModel = entityModel;
            $state.go("entityDetails");
          })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
          });
          */
      };
      //----------------------------------------//
      $scope.resumeEntity = function (type, name) {
        console.log("play " + type + " - " + name);
        Falcon.postResumeEntity(type, name).success(function (data) {
          console.log(data);
          refreshLists();
        })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
          });
      };
      $scope.scheduleEntity = function (type, name) {
        console.log("play " + type + " - " + name);
        Falcon.postScheduleEntity(type, name).success(function (data) {
          console.log(data);
          refreshLists();
        })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
          });
      };


      $scope.stopEntity = function (type, name) {
        console.log("stop " + type + " - " + name);
        Falcon.postSuspendEntity(type, name).success(function (data) {
          console.log(data);
          refreshLists();
        })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
          });
      };
      $scope.suspendEntity = function (type, name) {
        console.log("pause " + type + " - " + name);
        Falcon.postSuspendEntity(type, name)
          .success(function (data) {
            console.log(data);
            refreshLists();
          })
          .error(function (err) {
            var error = X2jsService.xml_str2json(err);
            Falcon.success = false;
            Falcon.serverResponse = error.result;
          });
      };
      $scope.relationsEntity = function (type, name) {
        console.log("relations " + type + " - " + name);
      };
      $scope.closeAlert = function () {
        $scope.serverResponse.status = undefined;
      };
      $scope.resetCluster = function () {
        EntityModel.clusterModel = {cluster: {interfaces: {interface: [
          {_type: "readonly", _endpoint: "hftp://", _version: ""},
          {_type: "write", _endpoint: "hdfs://", _version: ""},
          {_type: "execute", _endpoint: "", _version: ""},
          {_type: "workflow", _endpoint: "http://", _version: ""},
          {_type: "messaging", _endpoint: "tcp://", _version: ""}
        ]},
          locations: {location: []}, _xmlns: "uri:falcon:cluster:0.1", _name: "", _description: "", _colo: ""}
        };
      };

    }]);


})();
