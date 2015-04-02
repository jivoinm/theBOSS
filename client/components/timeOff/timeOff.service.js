'use strict';

angular.module('theBossApp')
  .service('timeOff', function ($resource) {
    return $resource('/api/timeoffs/:id', {id: '@_id'});
  });
