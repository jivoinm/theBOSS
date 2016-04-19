'use strict';

angular.module('theBossApp')
  .service('OrderService', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@_id'}, {
            'query': {
                method: 'GET',
                isArray: false
            },
            'services': {
                url: '/api/orders/services',
                isArray: false,
                method: 'GET'
            },
            'download': {
                url: '/api/orders/download/:filename',
                params: {
                    filename: '@filename'
                },
                isArray: false,
                method: 'GET'
            },
            'newAndNotCompletedServices': {
                url: '/api/orders/newAndNotCompletedServices',
                isArray: true,
                method: 'GET'
            },
            'newAndNotCompletedServicesOlderThanTwoWeeks': {
                url: '/api/orders/newAndNotCompletedServicesOlderThanTwoWeeks',
                isArray: true,
                method: 'GET'
            },
            'tasks': {
                url: '/api/orders/todotasks',
                method: 'GET'
            },
            'shippingList': {
                url: '/api/orders/shippingList',
                method: 'GET',
                isArray: false
            },
            'accessories': {
                url: '/api/orders/accessories',
                method: 'GET',
                isArray: false,
                params: {
                    status: '@status'
                }
            },
            'comments': {
                url: '/api/orders/comments',
                method: 'GET',
                isArray: true
            },
            'getOrders': {
                url: '/api/orders/calendar/:from/:to/orders/:status',
                params: {
                    status: '@status',
                    from: '@from',
                    to: '@to'
                },
                isArray: true,
                method: 'GET'
            },
            'getOrderServices': {
                url: '/api/orders/calendar/:from/:to/services/:approved/:completed',
                params: {
                    approved: '@approved',
                    completed: '@completed',
                    from: '@from',
                    to: '@to'
                },
                isArray: true,
                method: 'GET'
            },
            'setStatus': {
                url: '/api/orders/:orderId/status/:status',
                params: {
                    orderId: '@_id',
                    status: '@status'
                },
                method: 'PATCH'
            },
            'setdate_required': {
                url: '/api/orders/:orderId/calendar_update_date/:property/:date',
                params: {
                    orderId: '@orderId',
                    property: '@property',
                    date: '@date'
                },
                method: 'PATCH'
            }
        });
  });
