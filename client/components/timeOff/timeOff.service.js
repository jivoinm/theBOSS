'use strict';

angular.module('theBossApp')
  .service('timeOff', function ($resource) {
    return $resource('/api/timeoffs/:id', {id: '@_id'},  {
      'getTimeOff': {
        url: '/api/timeoffs/query/:approved/:dateFrom/:dateTo',
        params: {
            approved: '@approved',
            from: '@dateFrom',
            to: '@dateTo'
        },
        isArray: true,
        method: 'GET'
      },
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
