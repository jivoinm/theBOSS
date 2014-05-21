'use strict';

angular.module('theBossApp')
  .service('FormService', ['$resource', function($resource) {
    return $resource('/api/forms/:module', {module: '@module'},{
        'get': {
            method: 'GET',
            isArray: true
        },
        'addField':{
            method: 'PUT',
            url: '/api/forms/:id/field',
            params: {
                id: '@id'
            }
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
