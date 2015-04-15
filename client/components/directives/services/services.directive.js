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
     	  var query = {};
        query.approved = false;
        query.limit = null;
        query.page = null;
        OrderService.services(query).$promise.then (function (data) {
        	  scope.orders = data.orders;
            scope.totalOrders = data.totalOrders;
        });
      }
    };
  });
