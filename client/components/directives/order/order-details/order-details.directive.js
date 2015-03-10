'use strict';

angular.module('theBossApp')
  .directive('orderDetails', function ($rootScope) {
    return {
      templateUrl: 'components/directives/order/order-details/order-details.html',
      restrict: 'E',
      scope: {
          order: '='
      },
      link: function () {
      }
    };
  });
