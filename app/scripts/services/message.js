'use strict';

angular.module('theBossApp')
    .service('Message', ['$resource', function ($resource) {
        return $resource('/api/messages/:id', {id:'@id'});
    }]);
