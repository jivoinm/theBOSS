'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService', function ($scope, OrderService) {
        $scope.list = [];
        $scope.errors = [];

        var orderQuery = {};
        if ($scope.currentUser.user_id) {
            orderQuery.created_by = $scope.currentUser.user_id;
        }
        OrderService.get(orderQuery, function (res) {
            $scope.list = res;
        }, function (err) {
            //log error
            $scope.errors.push(err);
        });
    }]);
