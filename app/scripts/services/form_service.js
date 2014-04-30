'use strict';

angular.module('theBossApp')
  .service('FormService', ['$resource', function($resource) {
    return $resource('/api/forms/:module', {module: '@module'},{
        'get': {
            method: 'GET',
            isArray: true
        }
    });
  }]);
