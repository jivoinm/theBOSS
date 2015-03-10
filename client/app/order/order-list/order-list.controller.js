'use strict';

angular.module('theBossApp')
  .controller('OrderListCtrl', function ($scope, OrderService, $stateParams) {
    $scope.$parent.pageHeader = 'Orders';
    $scope.orders = [];
    $scope.totalOrders = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 10;

    if($stateParams.status){
        $scope.orderStatus = $stateParams.status;
    }

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

    $scope.loadOrders();

    $scope.$watch('currentPage', function () {
        $scope.loadOrders();
    });
  });
