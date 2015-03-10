'use strict';

angular.module('theBossApp')
  .service('Note', function ($resource) {
        return $resource('/api/notes/:id', {id:'@_id'},{
          'New': {
            url: '/api/notes',
                method: 'GET',
                isArray: true,
                params: {
                    resolved: false
                },
          },
            'OrderNotes': {
                url: '/api/notes',
                method: 'GET',
                isArray: true,
            },

        });
    });
