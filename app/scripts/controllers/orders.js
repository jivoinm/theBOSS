'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User', function ($scope, OrderService,User) {
        $scope.list = [];
        $scope.errors = [];

        //load user orders first
        User.orders({id:$scope.currentUser.user_id}, function (res) {
            var orderList = res.map(function(item){
                return {title:item.customer.name,date:item.last_updated_on,detail:'Has '+item.projects.length+' projects'}
            });

            $scope.list = orderList;
        }, function (err) {
            //log error
            $scope.errors.push(err);
        });

    }]);
