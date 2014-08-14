'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:roleAccess
 * @description
 * # roleAccess
 */
angular.module('theBossApp')
  .directive('roleAccess', ['roles', function (roles) {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

      }
    };
  }]);
