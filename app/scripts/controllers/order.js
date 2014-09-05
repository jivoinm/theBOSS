'use strict';
angular.module('theBossApp')
  .controller('OrderCtrl', ['$scope', '$location', 'OrderService', 'ModalService','order', 'toaster', 'roles', 
    function ($scope, $location, OrderService, ModalService, order, toaster, roles) {
        $scope.actives = {};
        $scope.getOrderName = function(){
            var name = 'New Order';
            if($scope.order &&  $scope.order._id){
                name = '['+($scope.order.po_number ? $scope.order.po_number : '##') + '] '
                    + ($scope.order.customer ? $scope.order.customer.name : '???')
            }
            return name;
        }
        
        $scope.order = order;
        $scope.orderOriginal = angular.copy(order);
        $scope.preview = false;
        $scope.$parent.pageHeader = $scope.getOrderName();
        if(order._id){
            $scope.preview = true;
        }
      
        $scope.edit = function (){
            $scope.preview = false;
        }

        $scope.redirectToList = function(){
            $location.path('/orders');
        }

        $scope.saveOrder = function(){
            $scope.order.$save(function(savedOrder){
                    if($scope.order._id)
                    {
                        $scope.redirectToList();
                    }else{
                        $scope.order = savedOrder;
                    }
                    toaster.pop('success', "Success", 'Saved you order '+ $scope.getOrderName());
                },function(err){
                    toaster.pop('error', "Error", 'Error saving you order '+ err);
                });
        }

        //Save order
        $scope.save = function (isValidForm){
            if(isValidForm){
                if(!roles.validateRoleAdmin() && $scope.order.ordered_accessories.length === 0){
                    ModalService.confirm('Do you want to add accesories to this order?', function(confirmed){
                        if(confirmed){
                           $scope.actives.two = true;
                           return;
                        }else{
                            $scope.saveOrder();
                        }
                     })
                }else{
                    $scope.saveOrder();
                }
                
            }
        }



        //Delete order
        $scope.delete = function (){
            ModalService.confirmDelete('Are you sure you want to delete this order?', function(confirmed){
                if(confirmed){
                    $scope.order.$delete(function(){
                        $scope.redirectToList();
                        toaster.pop('success', "Success", 'Deleted you order '+ $scope.getOrderName());
                    },function(err){
                        toaster.pop('error', "Error", 'Error deleting order '+ err);
                    });
                }
            })
        }
  }]);
