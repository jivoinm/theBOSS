'use strict';

angular.module('theBossApp')
  .directive('orderAccessories', function ($rootScope, theBossSettings, ModalService, toaster) {
    return {
        templateUrl: 'components/directives/order/order-accessories/order-accessories.html',
        restrict: 'E',
        scope:true,
        link: function postLink(scope, element, attrs) {
            if(!scope.order){
                element.text('Missing order on the scope');
                return;
            }

            $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                scope.preview = preview;
            });


            scope.order_accessories_fields = [{title:'From Manufacturer', type:'text', require: true, value:''},
              {title:'Description', type:'text', require: true}, {title:'Quantity', type:'number', require: true}
            ];

            scope.addNewAccessory = function(form){
                ModalService.show.modalFormDialog('Add new Accessory',
                    scope.order_accessories_fields, function(model){
                        if(model){
                            if(form){
                                if(!form.$save){
                                  form = new OrderService(form);
                                }
                                form.ordered_accessories.unshift(model);
                                form.$save(function(savedResponse){
                                    toaster.pop('success', "Accessory was saved with success");
                                }, function(err) {
                                    toaster.pop('error', "There was an error saving service on server, "+err.message);
                                });
                            }
                            model = null;
                        }
                    })();

            };
        }
    };
  });
