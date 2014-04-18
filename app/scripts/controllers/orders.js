'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User', function ($scope, OrderService,User) {
        $scope.$parent.pageHeader = 'Orders';
        $scope.list = [];
        $scope.errors = [];

        //load user orders first
        User.orders({id:$scope.currentUser.user_id}, function (res) {
            angular.forEach(res, function (item, key) {
                this.push({
                    'id': item._id,
                    'title': item.customer.name,
                    'date': item.last_updated_on,
                    'detail': 'Has ' + item.projects.length + ' projects',
                    'status': item.status || ''
                });
            }, $scope.list)
        }, function (err) {
            //log error
            $scope.errors.push(err);
        });

        $scope.edit = function (order) {
            //load order
            OrderService.get({orderId: order.id}).$promise.then(function (order) {
                console.log('get order ' + order._id);
                //populate form
            }).catch(function (err) {
                    $scope.errors.push(err);
                });
        }

    }]);
