'use strict';

angular.module('theBossApp')
  .directive('newOrders', function (OrderService) {
    return {
      templateUrl: 'components/directives/new-orders/new-orders.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
      	scope.totalOrders = 0;
      	scope.orders = [];
     	var query = {};
        query.status = 'new';
        query.limit = null;
        query.page = null;
        OrderService.query(query).$promise.then (function (data) {
        	scope.orders = data.orders;
            scope.totalOrders = data.totalOrders;
        });
      }
    };
  });
