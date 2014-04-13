'use strict';

angular.module('theBossApp')
    .service('OrderService', ['$resource', function ($resource) {
        return $resource('/api/orders/:orderId', {orderId: '@id'}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }]);
