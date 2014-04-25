'use strict';

angular.module('theBossApp')
  .service('ProjectServ', ['$http','$q', function($http,$q) {
    return {
        getAll:function(){
            return $http.get('/api/project').then(function(response) {
                if (typeof response.data === 'object') {
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }

            }, function(response) {
                // something went wrong
                return $q.reject(response.data);
            });
        }
    }
  }]);
