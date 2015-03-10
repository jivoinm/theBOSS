'use strict';

angular.module('theBossApp')
  .directive('orderServices', function ($rootScope, theBossSettings, ModalService, toaster) {
    return {
      templateUrl: 'components/directives/order/order-services/order-services.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if(!scope.order){
            element.text('Missing order on the scope');
            return;
        }

        scope.order_service_fields = [
            {title:'Date', type:'date', require: true},
            {title:'Details', type:'textarea', require: true},
            //{title:'Done By', type:'user', require: false}
        ];
        scope.completed = function (order, service){
            service.completed = true;
            order.$save(function (orderSaved) {
                console.log(orderSaved);
            });
        }

        scope.addNewService = function(form){
            ModalService.modalFormDialog('Add new field',
                scope.order_service_fields, function(model){
                    if(model){
                        if(form && form.$save){
                            form.services.unshift(model);
                            form.$save(function(savedResponse){
                                toaster.pop('success', "Service was saved with success");
                            }, function(err) {
                                toaster.pop('error', "There was an error saving service on server, "+err.message);
                            });
                        }
                        model = null;
                    }
                })

        }
      }
    };
  });
