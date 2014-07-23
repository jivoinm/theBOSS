'use strict';

angular.module('theBossApp')
    .service('OrderService', ['$resource', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@_id'}, {
            'query': {
                method: 'GET',
                isArray: false
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
            'comments': {
                url: '/api/orders/comments',
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
            },
            'setDateRequired': {
                url: '/api/orders/:orderId/daterequired/:date_required',
                params: {
                    orderId: '@orderId',
                    date_required: '@date_required'
                },
                method: 'PATCH'
            },
            'getOrders': {
                url: '/api/orders/:status/:from/:to',
                params: {
                    status: '@status',
                    from: '@from',
                    to: '@to'
                },
                isArray: false,
                method: 'GET'
            }

        });
    }]);
