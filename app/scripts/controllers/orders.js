'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService', '$routeParams', 'ModalService', function ($scope, OrderService, $routeParams, ModalService) {
        $scope.orders = [];

        if($routeParams.status){
            $scope.orderStatus = $routeParams.status;
        }

        $scope.loadOrders = function (){
            var query = {};
            if($scope.orderStatus){
                query.status = $scope.orderStatus;
            }

            if($scope.queryText){
                query.text = $scope.queryText;
            }

            OrderService.query(query).$promise.then (function (orders) {
                $scope.orders = orders;
            });
        }

        $scope.loadOrders();

    }]);
