'use strict';

angular.module('theBossApp')
    .service('OrderService', ['$resource', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@_id'}, {
            'query': {
                method: 'GET',
                isArray: true
            },
            'projects': {
                url: '/api/orders/:orderId/projects',
                method: 'GET',
                params: {
                    orderId:'@id'
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

            'unscheduledOrders': {
                url: '/api/orders/unscheduled',
                method: 'GET',
                isArray: true
            },

            'setScheduled': {
                url: '/api/orders/:orderId/:scheduled',
                params: {
                    orderId: '@id',
                    scheduled: '@scheduled'
                },
                method: 'PATCH'
            }

        });
    }]);
