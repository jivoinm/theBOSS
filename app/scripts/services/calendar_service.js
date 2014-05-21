'use strict';

angular.module('theBossApp')
    .service('CalendarService', ['$resource', function($resource) {
        return $resource('/api/calendar/:calendarId', {calendarId: '@_id'},{
            'getMonthEvents': {
                url: '/api/calendar/:from/:to',
                method: 'GET',
                isArray: true,
                params:{from: '@from',to: '@to'}
            },
            'update': { method:'POST' }

        });
    }]);
