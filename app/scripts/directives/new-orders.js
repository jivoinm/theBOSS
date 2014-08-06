'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:newOrders
 * @description
 * # newOrders
 */
angular.module('theBossApp')
  .directive('newOrders', ['OrderService', function (OrderService) {
    return {
      templateUrl: '/views/directive-templates/new-orders.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
      	scope.totalOrders = 0;
      	scope.orders = [];
     	var query = {};
        query.status = 'New';
        query.limit = null;
        query.page = null;
        OrderService.query(query).$promise.then (function (data) {
        	scope.orders = data.orders;
            scope.totalOrders = data.totalOrders;
        });
      }
    };
  }]);
