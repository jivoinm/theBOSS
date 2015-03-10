'use strict';

angular.module('theBossApp')
.directive('restrictedAccess', function (Auth, roles) {
  return {
    restrict: 'A',
    link: function postLink(scope, element) {
      if(roles && !roles.validateRoleAdmin(Auth.getCurrentUser())){
        element.remove();
      }
    }
  };
});
