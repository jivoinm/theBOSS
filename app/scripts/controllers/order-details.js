'use strict';

angular.module('theBossApp')
  .controller('OrderDetailsCtrl', ['$scope', '$routeParams', 'OrderService',function ($scope, $routeParams, OrderService) {
        if($routeParams.orderId){
            OrderService.get({orderId:$routeParams.orderId}, function(order){
                $scope.order = order;
            })
        }

  }]);
