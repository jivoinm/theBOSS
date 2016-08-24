'use strict';

angular.module('theBossApp')
  .service('userGroup', function ($resource) {
     return $resource('/api/user_groups/:id', {id:'@_id'});
  });
