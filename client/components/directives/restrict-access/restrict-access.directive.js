'use strict';

angular.module('theBossApp')
.directive('restrictedAccess', function (Auth, roles) {
  return {
    restrict: 'A',
    link: function preLink(scope, element, attrs) {
      if(attrs.restrictedAccess){
        if(!roles.validateCurrentUserRoleIn(attrs.restrictedAccess)){
          element.remove();
        }
      }else{
        if(roles && !roles.validateRoleAdmin(Auth.getCurrentUser())){
          element.remove();
        }
      }
    }
  };
});
