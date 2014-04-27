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
        FormService.get({module:'order'}).$promise.then(function(res){
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
                //populate form
                $scope.order = order;
                $scope.loadProjects();

            }).catch(function (err) {
                    $scope.errors.push(err);
                });
        }

        $scope.loadTasks = function(){
            OrderService.tasks({orderId: $scope.order._id}).$promise.then(function(tasks){
               $scope.tasks = tasks;
            });
        }

        $scope.loadProjects = function(){
            OrderService.projects({orderId: $scope.order._id}).$promise.then(function(projects){
                $scope.projects = projects;
            });
        }

        $scope.saveOrder = function(form){
            $scope.submitted = true;
            console.log($scope.projects);
            if (form.$valid) {
               console.log(form.$valid);
            }

        }

        $scope.addProject = function(project){
            $scope.projects.push(project);
        }

    }]);
