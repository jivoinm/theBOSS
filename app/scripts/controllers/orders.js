'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User','FormService', function ($scope, OrderService,User,FormService) {
        $scope.$parent.pageHeader = 'Orders';
        $scope.list = [];
        $scope.errors = [];
        $scope.order = {};
        $scope.isAddressVisible = false;
        $scope.order.projects = [];
        $scope.available_projects = [];

        //load available projects
        FormService.get({module:'Order'}).$promise.then(function(res){
            $scope.available_projects = res;
        },function(err){
            console.log(err);
        });
        //load user orders first
        User.orders({id:$scope.currentUser.user_id}, function (res) {
            angular.forEach(res, function (item, key) {
                this.push({
                    'id': item._id,
                    'title': item.customer.name,
                    'date': item.last_updated_on,
                    'detail': 'Has ' + item.projects.length + ' projects',
                    'status': item.status || '',
                    'order': item
                });
            }, $scope.list)
        }, function (err) {
            //log error
            $scope.errors.push(err);
        });

        $scope.edit = function (order) {
            //load order
            $scope.list.forEach(function(item){
                if(item.id == order.id){
                    $scope.order = new OrderService(item.order);
                }
            });
        }

        $scope.saveOrder = function(form){
            $scope.submitted = true;
            if (form.$valid) {
                if(!$scope.order._id){
                    $scope.order = new OrderService($scope.order);
                }
                $scope.order.$save(function(){
                    $scope.order = {};
                    //notify that order was saved with success

                },function(err){
                    console.log(err);
                    //notify that there was an error saving the order
                });
            }

        }

        $scope.addProject = function(form){
            $scope.order.projects = $scope.order.projects || []
            $scope.order.projects.push({
                project: form.name,
                field_sets: form.field_sets,
                tasks: form.tasks
            });
        }

    }]);
