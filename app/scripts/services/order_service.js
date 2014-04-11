'use strict';

angular.module('theBossApp')
    .service('OrderService', ['$resource', function OrderService($resource) {
        return $resource('/api/orders', {}, {
            'get': {
                method: 'GET',
                isArray: true
            }
        });
    }]);
