'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User','FormService', 'toaster', function ($scope, OrderService, User, FormService, toaster) {
        var date = new Date();
        var requiredDate = new Date(new Date().setDate(date.getDate()+21));

        $scope.$parent.pageHeader = 'Orders';
        $scope.order = {date_required: requiredDate};
        $scope.isAddressVisible = false;
        $scope.order.projects = [];
        $scope.available_projects = [];

        function QueryOrders(query) {
            OrderService.query(query).$promise.then(function (res) {
                pushOrderToList(res);
            })
        }

        $scope.search = function(filter){
            $scope.list = [];
            var query = {query: filter.query, text: filter.text};
            if(filter.itemId){
                query.text = filter.itemId;
            }
            QueryOrders(query);

        }

        //load user orders first
        function pushOrderToList(res) {
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
        }

        function loadUserOrders(){
            $scope.list = [];
            QueryOrders();
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
                form_name: form.name,
                fields: form.fields,
                tasks: form.tasks
            });
        }

        $scope.taskStatusChange = function(task,status){
            task.changed_by = $scope.currentUser._id;
            task.changed_on = new Date();
            if(task.status)
                task.status_options.splice(task.status_options.indexOf(task.status),1);
            task.status = status;
            $scope.order.$save(function(order){
                toaster.pop('success', "Task status was changed to "+status);
                $scope.order = order;
            });
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
