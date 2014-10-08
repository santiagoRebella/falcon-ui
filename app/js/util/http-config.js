(function () {
  'use strict';
  var USER_ID = 'dashboard';

  /**
   * The $http response has more data than what we need, we are only interested
   * in the response body which is inside the response.data property so we unwrap it
   * for all the requests that end with /list which are api calls that return a collection.
   */
  angular.module('falcon.util.httpConfig', [])
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push([
        '$q',
        function ($q) {
          return {
            request: function (config) {
              config.params = config.params || {};
              config.params['user.name'] = USER_ID;
              return config;
            },

            response: function (response) {
              if (response.config.url.match(/\list/gi)) {
                return $q.when(unwrapList(response.data));
              }

              return response;
            }
          };
        }
      ]);
    });

  function unwrapList(wrappedList) {
    var clusterList = [];
    var typeOfData = Object.prototype.toString.call(wrappedList.entity);
    if(typeOfData === "[object Array]") {
      clusterList = wrappedList.entity;
    } else if(typeOfData === "[object Object]") {
      clusterList = [wrappedList.entity];
    } else {
      console.log("type of wrappedList not recognized");
    }
    return clusterList;
  }


}());