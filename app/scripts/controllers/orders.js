'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User', function ($scope, OrderService,User) {
        $scope.list = [];
        $scope.errors = [];

        //load user orders first
        User.orders({id:$scope.currentUser.user_id}, function (res) {
            $scope.list = res;
        }, function (err) {
            //log error
            $scope.errors.push(err);
        });

    }]);
