'use strict';

angular.module('theBossApp')
  .directive('accessories', function (OrderService, toaster) {
        return {
            restrict: 'E',
            templateUrl: 'components/directives/accessories/accessories.html',
            scope: false,
            link: function (scope) {
                scope.orders = [];
                scope.totalOrders = 0;
                scope.currentPage = 1;
                scope.maxSize = 10;

                scope.notreceived = {received:false};
                scope.loadAccessories = function (){
                  var query = {};
                  query.limit = scope.maxSize = 10;
                  query.page = scope.currentPage;
                  OrderService.accessories(query).$promise.then(function(data){
                      scope.orders = data.orders;
                      scope.totalOrders = data.totalOrders;
                  });
                };

                scope.saveUpdates = function(index,order,accessory) {
                    if(accessory.items_received) {
                        accessory.received = accessory.items_received >= accessory.quantity;
                        accessory.date_received = new Date();
                        if(!order.$save){
                          order = new OrderService(order);
                        }

                        order.$save(function(){
                            if(accessory.received){
                                order.ordered_accessories.splice(index,1);
                                toaster.pop('success', "Success", 'Received all '+ accessory.description);
                            }else{
                                toaster.pop('success', "Success", 'Updated items received for '+ accessory.description);
                            }

                        });
                    }else{
                         toaster.pop('error', "Error", 'Nothing was set as received.');
                    }

                };

                scope.loadAccessories();
                scope.$watch('currentPage', function (pageNoNew, pageNoOld) {
                    if(pageNoNew != pageNoOld){
                        scope.loadAccessories();
                    }
                });
            }
        };
  });
