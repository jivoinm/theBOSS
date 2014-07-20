'use strict';

angular.module('theBossApp')
    .service('OrderService', ['$resource', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@_id'}, {
            'get': {
                method: 'GET',
                isArray: false
            },
            'query': {
                method: 'GET',
                isArray: true
            },
            'projects': {
                url: '/api/orders/:orderId/projects',
                method: 'GET',
                params: {
                    orderId:'@_id'
                },
                isArray: true
            },

            'tasks': {
                url: '/api/orders/tasks',
                method: 'GET',
                isArray: true
            },
            'accessories': {
                url: '/api/orders/accessories',
                method: 'GET',
                isArray: true
            },

            'setStatus': {
                url: '/api/orders/:orderId/status/:status',
                params: {
                    orderId: '@_id',
                    status: '@status'
                },
                method: 'PATCH'
            }

        });
    }]);
