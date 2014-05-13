'use strict';

angular.module('theBossApp')
  .service('FormService', ['$resource', function($resource) {
    return $resource('/api/forms/:module', {module: '@module'},{
        'get': {
            method: 'GET',
            isArray: true
        },
        'addFieldOption': {
            method: 'PUT',
            url: '/api/forms/:module/:field/:option',
            params: {
                module: '@module',
                field: '@field',
                option: '@option'
            }
        }
    });
  }]);
