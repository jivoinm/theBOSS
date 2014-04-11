'use strict';

angular.module('theBossApp')
    .factory('Session', ['$resource', function ($resource) {
        return $resource('/api/session/');
    }]);
