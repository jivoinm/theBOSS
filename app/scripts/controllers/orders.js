'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService', function ($scope, OrderService) {
        var orderQuery = {};
        if ($scope.currentUser.user_id) {
            orderQuery['user_id'] = $scope.currentUser.user_id;
        }
        OrderService.get(orderQuery, function (res) {
            console.log(res);
        }, function (err) {
            console.log(err);
        });
    }]);
