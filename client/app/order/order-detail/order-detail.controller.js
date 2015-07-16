'use strict';

angular.module('theBossApp')
  .controller('OrderDetailCtrl', function ($scope, $location, OrderService, ModalService, toaster, roles, datepickerConfig,
    $timeout, order, timeOff, $filter, theBossSettings) {

        $scope.actives = {};

        $scope.getOrderName = function(){
            var name = 'New Order';
            if($scope.order &&  $scope.order._id){
                name = '['+($scope.order.po_number ? $scope.order.po_number : '##') + '] ' + ($scope.order.customer ? $scope.order.customer.name : '???');
            }
            return name;
        };

        $scope.order = order;
        $scope.orderOriginal = {};
        $scope.preview = false;
        $scope.$parent.pageHeader = $scope.getOrderName();
        var timeout = null;


        if($scope.order && $scope.order._id){
            $scope.preview = true;
        }


        $scope.isActiveTab = function(tab){
          return $scope.selectedTab === tab;
        };

        $scope.selectTab = function(tab){
          $scope.selectedTab = tab;
        };

        $scope.isNewOrder = function(){
          return !$scope.order._id;
        };

        $scope.edit = function (){
            $scope.preview = false;
        };

        $scope.redirectToList = function(){
            $location.path('/orders');
        };

        $scope.validateForm = function(form){
          return form.customer && 
                form.customer.name && 
                form.customer.ship_to &&
                form.customer.phone &&
                form.po_number &&
                form.date_required;
        };

        $scope.saveOrder = function(){
            $scope.order.$save(function(savedOrder){
                if($scope.order._id)
                {
                    $scope.redirectToList();
                }else{
                    $scope.order = savedOrder;
                }
                toaster.pop('success', 'Success', 'Saved you order '+ $scope.getOrderName());
            },function(err){
              $scope.errors = err.errors;
              toaster.pop('error', 'Error saving you order', 'Check that all required field are entered.');
            });
        };

        //Save order
        $scope.save = function (form){
            if($scope.validateForm($scope.order)){
                if(!roles.validateRoleAdmin() && $scope.order.ordered_accessories && $scope.order.ordered_accessories.length === 0){
                    ModalService.confirm.question('Do you want to add accesories to this order?', function(confirmed){
                        if(confirmed){
                           $scope.actives.two = true;
                           return;
                        }else{
                            $scope.saveOrder();
                        }
                     })();
                }else{
                    $scope.saveOrder();
                }
            }else{
             toaster.pop('error', 'Error saving you order', 'Check that all required field are entered.'); 
            }
        };

        //Delete order
        $scope.delete = function (){
            ModalService.confirm.delete(function(){
                $scope.order.$delete(function(){
                    $scope.redirectToList();
                    toaster.pop('success', 'Success', 'Deleted you order '+ $scope.getOrderName());
                },function(err){
                    toaster.pop('error', 'Error', 'Error deleting order '+ err);
                });
            })($scope.getOrderName()+' order');
        };

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

        $scope.minDate = $scope.order ? $scope.order.date_required : null;
        datepickerConfig.minDate = $scope.minDate;
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

        $scope.updateOrderOnChange = function (newValue, oldValue, message){
          if (newValue !== oldValue) {
            if (timeout) {
              $timeout.cancel(timeout);
              timeout = null;
            }else{
              timeout = $timeout(function(){
                  $scope.order.$save(function(order){
                    $scope.order = order;
                    toaster.pop('success', 'Success', message);
                  },function(err){
                    $scope.errors = err.errors;
                    toaster.pop('error', 'Error', 'Error saving you order '+ err);
                  });
            }, 1000);  // 1000 = 1 second
           }
          }
        };


        $scope.$watch('order.installation_date', function(newValue, oldValue) {
          $scope.updateOrderOnChange(newValue, oldValue, 'Saved installation date');
        }, true);

        $scope.$on(theBossSettings.userAutoCompleteSelectedEvent, function(event, userSelected) {
          var message = 'Successfully saved '+userSelected.fieldName+' to '+userSelected.value;
          $scope.updateOrderOnChange(1, 0, message);
        }, true);


        $scope.$watch('order.date_required', function(newValue, oldValue) {
          if (newValue !== oldValue && newValue && !$scope.order._id) {
            timeOff.check({date:newValue}).$promise.then(function(data){
              if(data.length > 0){
                var timeOffMessage = 'There are time offs for this period:<br>';
                angular.forEach(data, function(item){
                  var fromDate = $filter('date')(item.from);
                  var toDate = $filter('date')(item.to);
                  timeOffMessage += (item.type === 'Statutory holiday' ? item.detail : item.createdBy.name) + ' - '+ item.type + ' - '+ fromDate + ' - ' + toDate +'<br>';
                });
                timeOffMessage += '<strong>Continue?</strong>'
                ModalService.confirm.question(timeOffMessage, function(confirmed){
                    if(confirmed){
                       return;
                    }else{
                      $scope.order.date_required = null;
                    }
                 })();
             }
            },function(err){
              toaster.pop('error', 'Error', 'Error loading time off '+err);
            });
           }
        }, true);
  });
