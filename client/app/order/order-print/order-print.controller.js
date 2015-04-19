'use strict';

angular.module('theBossApp')
  .controller('OrderPrintCtrl', function ($scope, order, $stateParams, $window, $filter, ModalService, toaster) {
    var service = order.services[$stateParams.action];
    $scope.action = service.title;
    $scope.order = order;
    $scope.getFormDate =  function (){
      return $filter('date')(service.date);
    };
    var fields = [
        {title:'Date', type:'date', require: true, value: service.date},
    ];
    $scope.print = function(){
      ModalService.show.modalFormDialog('Confirm service date',
          fields, function(model){
              if(model){
                  if(order){
                      if(!order.$save){
                        order = new OrderService(order);
                      }
                      order.services[$stateParams.action].date = model.date;
                      order.$save(function(savedResponse){
                          toaster.pop('success', "Service form sent to printer with success");
                          $window.print();
                          $window.history.back();
                      }, function(err) {
                          toaster.pop('error', "There was an error saving service on server, "+err.message);
                      });
                  }
              }
          })();

    };
  });
