'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService', '$routeParams', function ($scope, OrderService, $routeParams) {
        $scope.orders = [];
        //$scope.orderStatus = 'new';

        if($routeParams.status){
            $scope.orderStatus = $routeParams.status;
        }

        $scope.loadOrders = function (){
            var query = {};
            if($scope.orderStatus){
                query.status = $scope.orderStatus;
            }

//            if(queryText){
//                query.text = queryText;
//            }

            OrderService.query(query).$promise.then (function (orders) {
                $scope.orders = orders;
            });
        }

        $scope.loadOrders();

    }]);
