'use strict';

angular.module('theBossApp')
    .service('Message', ['$resource', function ($resource) {
        return $resource('/api/messages/:id', {id:'@_id'},{
        	'New': {
        		url: '/api/messages',
                method: 'GET',
                isArray: true,
                params: {
                    resolved: false
                },
        	},
            'OrderMessages': {
                url: '/api/messages',
                method: 'GET',
                isArray: true,
            },
            
        });
    }]);
