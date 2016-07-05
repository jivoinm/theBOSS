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
      resetPassword: {
        method: 'PUT',
        params: {
          controller:'resetPassword'
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
          url: '/api/users/:id/role/:role',
          params: {
              id: '@_id',
              role: '@role',
          },
      },
      updateGroups: {
          method: 'POST',
          url: '/api/users/:id/groups',
          params: {
              id: '@_id',
              groups: '@groups',
          }
      }
	  });
  });
