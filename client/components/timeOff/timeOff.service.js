'use strict';

angular.module('theBossApp')
  .service('timeOff', function ($resource) {
    return $resource('/api/timeoffs/:id', {id: '@_id'},  {
      'check': {
          url: '/api/timeoffs/check',
          isArray: true,
          method: 'GET'
      },
      'new': {
        url: '/api/timeoffs/totalNewTimeoffs',
        isArray: false,
        method: 'GET'
      }
    });
  });
