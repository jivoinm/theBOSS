'use strict';

angular.module('theBossApp')
    .service('OrderService', ['$resource', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@id'}, {
            'query': {
                method: 'GET',
                isArray: true
            },
            'projects' : {
                url: '/api/orders/:orderId/projects',
                method: 'GET',
                params: {
                    orderId:'@id'
                },
                isArray: true
            },
            'tasks' : {
                url: '/api/orders/:orderId/tasks',
                method: 'GET',
                params: {
                    orderId:'@id'
                },
                isArray: true
            }
        });
    }]);
