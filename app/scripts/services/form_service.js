'use strict';

angular.module('theBossApp')
  .service('FormService', ['$resource', function($resource) {
    return $resource('/api/forms/:module', {module: '@module'},{
        'query': {
            method: 'GET',
            isArray: true
        }
    });
  }]);
