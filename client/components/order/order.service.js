'use strict';

angular.module('theBossApp')
  .service('OrderService', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@_id'}, {
            'query': {
                method: 'GET',
                isArray: false
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
                isArray: true,
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
                url: '/api/orders/calendar/:from/:to/:status',
                params: {
                    status: '@status',
                    from: '@from',
                    to: '@to'
                },
                isArray: false,
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
