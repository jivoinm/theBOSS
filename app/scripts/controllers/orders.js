'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User','FormService', 'toaster', function ($scope, OrderService, User, FormService, toaster) {
        $scope.$parent.pageHeader = 'Orders';
        $scope.order = {};
        $scope.isAddressVisible = false;
        $scope.order.projects = [];
        $scope.available_projects = [];

        //load available projects
        FormService.get({module:'Order'}).$promise.then(function(res){
            $scope.available_projects = res;
        },function(err){
            toaster.pop('error', "Error saving the order",err.message? err.message : err);
        });
        //load user orders first
        function loadUserOrders(){
            $scope.list = [];
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
                toaster.pop('error', "Error saving the order",err.message? err.message : err);
            });
        }


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

                $scope.order.$save({orderId:$scope.order._id},function(){
                    $scope.order = {};
                    $scope.submitted = false;
                    loadUserOrders();

                    toaster.pop('success', $scope.order._id ? "Existing Order was updated":"New order was created with success");
                },function(err){
                    toaster.pop('error', "Error saving the order",err.message? err.message : err);
                });
            }

        }

        $scope.reset = function(){
            $scope.order = {};
            $scope.submitted = false;
        }

        $scope.addProject = function(form){
            $scope.order.projects = $scope.order.projects || []
            $scope.order.projects.push({
                project: form.name,
                field_sets: form.field_sets,
                tasks: form.tasks
            });
        }

        $scope.taskStatusChange = function(task,status){
            task.status = status;
            task.changed_by = $scope.currentUser._id;
            task.changed_on = new Date();

        }

        loadUserOrders();
        $scope.$watchCollection('order.projects',function(){
            var hours = 0;
            if($scope.order && $scope.order.projects){
                $scope.order.projects.forEach(function(project){
                    if(project.tasks){
                        project.tasks.forEach(function(task){
                            hours += +task.duration.replace(/h$/,"");
                        })
                    }
                })
            }
            $scope.total_working_hours = hours;
        });

        $scope.$watch('myOwnFile',function(newValue){
            console.log( "file changed", newValue);
        });
    }]);
