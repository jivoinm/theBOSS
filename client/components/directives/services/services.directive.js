'use strict';

angular.module('theBossApp')
  .directive('services', function (OrderService) {
    return {
      templateUrl: 'components/directives/services/services.html',
      restrict: 'EA',
      scope: true,
      link: function (scope, element, attrs) {
        scope.totalOrders = 0;
      	scope.orders = [];
        OrderService.newAndNotCompletedServices().$promise.then (function (data) {
        	  scope.orders = data;
            scope.totalOrders = data.length;
        });
      }
    };
  });
