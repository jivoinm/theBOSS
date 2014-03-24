'use strict';

angular.module('theBossApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
