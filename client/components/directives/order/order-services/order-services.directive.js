'use strict';

angular.module('theBossApp')
  .directive('orderServices', function ($rootScope, theBossSettings, ModalService, toaster, $templateCache, $compile, OrderService) {
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
            {title:'Done By', type:'user', require: false, show_options: 'worker'}
        ];

        scope.completed = function (order, service){
          var question = 'Are you sure you want to '+ (service.approved && !service.completed ? 'approve' : 'complete')+' this service?';
          ModalService.confirm.question(question, function(confirm){
            if(confirm){
              if(!order.$save){
                order = new OrderService(order);
              }
              order.$save(function (orderSaved) {
                scope.order = orderSaved;
              });
            }else{
              service.approved = service.approved && !service.completed ? false : true;
              service.completed = service.approved && service.completed ? false : false;
            }
          })();
        };

        scope.delete = function (order, index){
          var question = 'Are you sure you want to delete this service?';
          ModalService.confirm.question(question, function(confirm){
            if(confirm){
              order.services.splice(index, 1);
              if(!order.$save){
                order = new OrderService(order);
              }
              order.$save(function (orderSaved) {
                scope.order = orderSaved;
              });
            }
          })();
        };



        scope.addNewService = function(form){
            var serviceNr = form.services ? form.services.length + 1 : 1;
            ModalService.show.modalFormDialog('Add new Service #'+serviceNr,
                scope.order_service_fields, function(model){
                    if(model){
                        if(form){
                            if(!form.$save){
                              form = new OrderService(form);
                            }
                            model.title = 'Service #'+serviceNr;
                            form.services.unshift(model);
                            form.$save(function(savedResponse){
                                toaster.pop('success', "Service was saved with success");
                            }, function(err) {
                                toaster.pop('error', "There was an error saving service on server, "+err.message);
                            });
                        }
                        model = null;
                    }
                })();

        };

        scope.print = function (){
          var popupWin = window.open('', '_blank', 'width=300,height=300');
          popupWin.document.open()
          popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()"><div ng-include="components/directives/order/order-services/order-installation-form.html"></div></body></html>');
          popupWin.document.close();

        };
      }
    };
  });
