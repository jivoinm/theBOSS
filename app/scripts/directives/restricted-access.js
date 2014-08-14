'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:restrictedAccess
 * @description
 * # restrictedAccess
 */
angular.module('theBossApp')
  .directive('restrictedAccess', ['roles', function (roles) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      	if(!roles.validateRoleAdmin(scope.currentUser)){
      		element.hide();
      	}
      }
    };
  }]);
