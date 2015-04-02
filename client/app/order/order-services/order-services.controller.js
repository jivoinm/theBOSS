'use strict';

angular.module('theBossApp')
  .controller('OrderServicesCtrl', function ($scope, OrderService) {
    $scope.getOrderName = function(order){
        var name = '';
        if(order && order._id){
            name = '['+(order.po_number ? order.po_number : '##') + '] ' + (order.customer ? order.customer.name : '???');
        }
        return name;
    };

    $scope.loadOrders = function (){
        var query = {};
        if($scope.orderStatus){
            query.status = $scope.orderStatus;
        }

        if($scope.queryText){
            query.text = $scope.queryText;
        }

        query.limit = $scope.maxSize = 10;
        query.page = $scope.currentPage;

        OrderService.query(query).$promise.then (function (orders) {
            $scope.orders = orders.orders;
            $scope.currentPage = orders.page;
            $scope.totalOrders = orders.totalOrders;
        });
    };
  });
