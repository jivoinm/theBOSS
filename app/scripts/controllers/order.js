'use strict';
angular.module('theBossApp')
  .controller('OrderCtrl', ['$scope', '$location', 'OrderService', 'ModalService','order', 'toaster', '$rootScope', 'theBossSettings', function ($scope, $location, OrderService, ModalService, order, toaster, $rootScope, theBossSettings) {
        $scope.getOrderName = function(){
            var name = 'New Order';
            if($scope.order &&  $scope.order._id){
                name = '['+($scope.order.po_number ? $scope.order.po_number : '##') + '] '
                    + ($scope.order.customer ? $scope.order.customer.name : '???')
            }
            return name;
        }

        $scope.order = order;
        $scope.preview = false;
        if(order._id){
            $scope.preview = true;
        }
      
        $scope.edit = function (){
            $rootScope.$broadcast(theBossSettings.previewModeEvent,false);
        }
        
        $scope.redirectToList = function(){
            $location.path('/orders');
        }
        //Save order
        $scope.save = function (isValidForm){
            if(isValidForm){
                $scope.order.$save(function(){
                    $scope.redirectToList();
                    toaster.pop('success', "Success", 'Saved you order '+ $scope.getOrderName());
                },function(err){
                    toaster.pop('error', "Error", 'Error saving you order '+ err);
                });
            }
        }

        //Set order status
        $scope.setStatus = function (status){
            ModalService.confirm('You are about to '+status+' this order, are you sure?', function(confirmed){
                if(confirmed){
                    $scope.order.$setStatus({status:status}, function(order){
                        //$scope.order = order;
                        $rootScope.$broadcast(theBossSettings.orderChangedEvent,order);
                        toaster.pop('success', "Success", 'Updated status to '+ status);
                    },function(err){
                        toaster.pop('error', "Error", 'Error updating status '+ err);
                    });
                }
            })
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

        $scope.$parent.pageHeader = $scope.getOrderName();
  }]);
