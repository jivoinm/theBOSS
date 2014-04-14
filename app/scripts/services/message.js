'use strict';

angular.module('theBossApp')
    .service('Message', ['$resource', function ($resource) {
        return $resource('/api/messages/:userName', {}, {
            'get': {
                method: 'GET',
                params: {userName: '@userName'}
            }
        });
    }]);
