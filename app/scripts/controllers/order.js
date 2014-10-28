'use strict';
angular.module('theBossApp')
  .controller('OrderCtrl', ['$scope', '$location', 'OrderService', 'ModalService','order', 'toaster', 'roles', 'datepickerConfig', '$timeout', 
    function ($scope, $location, OrderService, ModalService, order, toaster, roles, datepickerConfig, $timeout) {
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
        var timeout = null;

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

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.minDate = $scope.order.date_required;
        datepickerConfig.minDate = $scope.order.date_required;
        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.$watch('order.installation_date', function(newValue, oldValue) {
            if (newValue != oldValue) {
              if (timeout) {
                $timeout.cancel(timeout)
                timeout = null;
              }else{
                timeout = $timeout(function(){
                    $scope.order.$save(function(savedOrder){
                        toaster.pop('success', "Success", 'Saved installation date');
                    },function(err){
                        toaster.pop('error', "Error", 'Error saving you order '+ err);
                    });
              }, 1000);  // 1000 = 1 second
             }
            }
        }, true);
  }]);
