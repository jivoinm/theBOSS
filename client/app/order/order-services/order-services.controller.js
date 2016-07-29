'use strict';

angular.module('theBossApp')
  .controller('OrderServicesCtrl', function ($scope, OrderService, $stateParams) {
    $scope.getOrderName = function(order){
        var name = '';
        if(order && order._id){
            name = '['+(order.po_number ? order.po_number : '##') + '] ' + (order.customer ? order.customer.name : '???');
        }
        return name;
    };

    if($stateParams.status){
        $scope.serviceStatus = $stateParams.status;
    }else{
      $scope.serviceStatus = null;
    }

    $scope.loadOrders = function (){
        var query = {};
        if($scope.serviceStatus){
            query.status = $scope.serviceStatus;
        }

        if($scope.queryText){
            query.text = $scope.queryText;
        }

        query.limit = $scope.maxSize = 10;
        query.page = $scope.currentPage;

        OrderService.services(query).$promise.then (function (orders) {
            $scope.orders = orders.orders;
            $scope.currentPage = orders.page;
            $scope.totalOrders = orders.totalOrders;
        });
    };

    $scope.loadOrders();
    $scope.$watch('currentPage', function (page1, page2) {
      if(page1 != page2)
      {
        $scope.loadOrders();
      }
    });
  });
