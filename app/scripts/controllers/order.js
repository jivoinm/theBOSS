'use strict';

angular.module('theBossApp')
  .controller('OrderCtrl', ['$scope', '$routeParams', 'OrderService', 'AlertService', 'ModalService', function ($scope, $routeParams, OrderService, AlertService, ModalService) {

        $scope.getOrderName = function(){
            var name = 'New Order';
            if($scope.order &&  $scope.order._id){
                name = 'Order '+ ($scope.order.po_number ? $scope.order.po_number : '##') + ' / '
                    + ($scope.order.customer ? $scope.order.customer.name : '???')
            }
            return name;
        }


        if($routeParams.id){
            OrderService.get({orderId: $routeParams.id}).$promise.then(function(order){
                //load order
                $scope.order = order;
            })
        }else{
            //create new orderService
            $scope.order = new OrderService({});
        }

        //Save order
        $scope.save = function (isValidForm){
            if(isValidForm){
                $scope.order.$save(function(){
                    AlertService.addSuccess('Saved '+ $scope.getOrderName());
                },function(err){
                    AlertService.addError('Error saving order '+err);
                });
            }
        }

        //Delete order
        $scope.delete = function (){
            ModalService.confirmDelete('Are you sure you want to delete this order?', function(confirmed){
                if(confirmed){
                    $scope.order.$delete(function(){
                        AlertService.addSuccess('Saved '+ $scope.getOrderName());
                    },function(err){
                        AlertService.addError('Error saving order '+err);
                    });
                }
            })
        }

        //update order status
        $scope.updateStatus = function (status){
            $scope.order.status = status;
            $scope.order.$save(function(){
                AlertService.addSuccess('Saved '+ $scope.getOrderName()+' with status '+status);
            },function(err){
                AlertService.addError('Error saving order '+err);
            });
        }

        //watch order changes and set the header name
        $scope.$watch('order', function(){
            $scope.$parent.pageHeader = $scope.getOrderName();
        });
  }]);
