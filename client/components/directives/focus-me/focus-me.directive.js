'use strict';

angular.module('theBossApp')
  .directive('focusMe', function($timeout) {
      return function(scope, element, attrs) {
          scope.$watch(attrs.focusMe, function(value) {
              console.log('focus', value)
              if(value === true) {
                  $timeout(function() {
                      element[0].focus();
                  }, 700);
              }
          });
      };
  });
