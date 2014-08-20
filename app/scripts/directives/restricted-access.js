'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:restrictedAccess
 * @description
 * # restrictedAccess
 */
angular.module('theBossApp')
  .directive('restrictedAccess', ['$rootScope', 'roles', function ($rootScope, roles) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      	if(!roles.validateRoleAdmin($rootScope.currentUser)){
      		element.remove();
      	}
      }
    };
  }]);
