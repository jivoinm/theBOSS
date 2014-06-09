'use strict';

angular.module('theBossApp')
  .service('FormService', ['$resource', function($resource) {
    return $resource('/api/forms/:id', {id:'@_id'},{
        'get': {
            method: 'GET',
            isArray: true,
            url: '/api/forms/:module',
            params: {
                module: '@module'
            }
        },
        'addField':{
            method: 'PUT',
            url: '/api/forms/:id/fields',
            params: {
                id: '@id'
            }
        },
        'deleteField':{
            method: 'DELETE',
            url: '/api/forms/:id/field/:fieldId',
            params: {
                id: '@_id',
                fieldId: '@fieldId'
            }
        },
        'updateField':{
            method: 'PUT',
            url: '/api/forms/:id/fields/:fieldId',
            params: {
                id: '@_id',
                fieldId: '@fieldId'
            }
        },
        'addOrUpdate':{
            method: 'PUT',
            url: '/api/forms/:id/:target/:targetId',
            params: {
                id: '@id',
                targetId: '@targetId',
                target: '@target'
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
        },
        'delete': {
            method: 'DELETE',
            url: '/api/forms/:id',
            params: {
                id: '@_id'
            }
        }

    });
  }]);
