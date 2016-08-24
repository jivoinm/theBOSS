'use strict';

angular.module('theBossApp')
  .directive('shippingList', function (OrderService, $timeout, toaster) {
        return {
            restrict: 'E',
            templateUrl: 'components/directives/shippingList/shippingList.html',
            scope: true,
            controller: function ($scope) {
                $scope.orders = [];
                $scope.totalOrders = 0;
                $scope.currentPage = 1;
                $scope.maxSize = 10;
                $scope.shipped_date = null;

                $scope.loadOrders = function(){
                    var query = {};
                    query.limit = $scope.maxSize = 10;
                    query.page = $scope.currentPage;

                    OrderService.shippingList(query).$promise.then(function(data){
                        $scope.orders = data.orders;
                        $scope.currentPage = data.page;
                        $scope.totalOrders = data.totalOrders;
                    });
                };

                if($scope.order){
                    $scope.orders = [$scope.order];
                }else{
                    $scope.loadOrders();
                }

                $scope.$watch('currentPage', function (pageNoNew, pageNoOld) {
                    if(pageNoNew !== pageNoOld){
                        $scope.loadOrders();
                    }
                });

            }
        };
    }
  )
  .directive('shippingListItem', function (OrderService, $timeout, toaster, ModalService, moment, theBossSettings) {
        return {
            restrict: 'E',
            templateUrl: 'components/directives/shippingList/shippingListItem.html',
            scope: {
                item: '='
            },
             link: function ($scope, element, attrs) {
                $scope.opened = false;
                $scope.today = function() {
                    $scope.dt = new Date();
                };
                $scope.today();

                $scope.clear = function () {
                    $scope.dt = null;
                };

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
                    startingDay: 1
                };

                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];

                var timeout = null;
                $scope.$watch('item.shipped_date', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                      if (timeout) {
                        $timeout.cancel(timeout);
                        timeout = null;
                      }else{
                        ModalService.confirm.question('Confirm shipping date of '+moment(newValue).zone(theBossSettings.timeZone).format('YYYY-MM-DD')+' set to order '+$scope.item.po_number,
                            function(confirmed){
                                if(confirmed){
                                    timeout = $timeout(function(){
                                            var order = new OrderService($scope.item);
                                            order.$save(function(savedOrder){
                                                $scope.item.shipped = true;
                                                toaster.pop('success', "Success", 'Shipped date was updated');
                                            },function(err){
                                                toaster.pop('error', "Error", 'Error saving you order '+ err);
                                            });
                                      }, 1000);  // 1000 = 1 second
                                }
                            })();
                      }
                    }
                });
            }
        };
    });
