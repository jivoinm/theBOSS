'use strict';

angular.module('theBossApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },

    {
      query: {
         method: 'GET',
         isArray: true
      },
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      updateRole: {
          method: 'POST',
          url: '/api/users/:id/:role',
          params: {
              id: '@_id',
              role: '@role',
          },
      }
	  });
  });
