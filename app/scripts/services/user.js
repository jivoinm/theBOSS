'use strict';

angular.module('theBossApp')
    .factory('User', ['$resource', function ($resource) {
        return $resource('/api/users/:id', {id: '@_id'}, { //parameters default
            'query': {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT',
                params: {}
            },
            updateRole: {
                method: 'POST',
                url: '/api/users/:id/:role',
                params: {
                    id: '@_id',
                    role: '@role',
                },
            },
            get: {
                method: 'GET',
                params: {
                    id: 'me'
                }
            },
            orders: {
                method: 'GET',
                url: '/api/users/:id/orders',
                params: {
                    id: 'me'
                },
                isArray: true
            }
        });
    }]);
