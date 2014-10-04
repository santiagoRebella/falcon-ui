(function (angular) {
  'use strict';

  /**
   * The $http response has more data than what we need, we are only interested
   * in the response body which is inside the response.data property so we unwrap it
   * for all the requests that end with .do which are our Spring MVC controllers.
   */
  angular.module('falcon.util.httpConfig', [])
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push([
        '$q', 'currentUser',
        function ($q, currentUser) {
          return {
            'request': function (config) {
              config.params = config.params || {};
              config.params['user.name'] = currentUser;
              return config;
            },

            'response': function (response) {
              //we can add code to check if the response is an object or an array
              if (response.config.url.match(/\list/gi)) {
                return $q.when(response.data);
              }

              return response;
            }
          };
        }
      ]);
    });

}());