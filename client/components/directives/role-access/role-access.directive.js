'use strict';

angular.module('theBossApp')
  .directive('roleAccess', function (roles) {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
