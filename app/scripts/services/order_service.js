'use strict';

angular.module('theBossApp')
    .service('OrderService', ['$resource', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@_id'}, {
//            'save': {
//                url: '/api/orders/:orderId',
//                method: 'POST',
//                params: {
//                    orderId:'@id'
//                }
//            },
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
                url: '/api/orders/:orderId/tasks',
                method: 'GET',
                params: {
                    orderId:'@id'
                },
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
                    orderId: '@_id',
                    scheduled: '@scheduled'
                },
                method: 'PATCH'
            }

        });
    }]);
