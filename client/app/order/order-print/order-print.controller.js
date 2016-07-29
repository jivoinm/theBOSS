'use strict';

angular.module('theBossApp')
  .controller('OrderPrintCtrl', function ($scope, order, $stateParams, $window, $filter, toaster, Auth, ModalService) {
    var service = order.services[$stateParams.action];
    $scope.action = service ? service.title : 'Installation';
    $scope.date = service ? service.date : order.installation_date;
    $scope.done_by = service ? service.done_by : order.installation_by;
    $scope.details = service ? service.details : '';
    $scope.order = order;
    $scope.getFormDate =  function (){
      return $filter('date')($scope.date);
    };
    if(Auth.getCurrentUser().role === 'worker') {
      var fields = [
          {title:'Done By', type:'user', require: true, value: $scope.done_by, show_options: 'worker'}
      ];
    } else {
          var fields = [
            {title:'Date', type:'date', require: true, value: $scope.date},
            {title:'Done By', type:'user', require: true, value: $scope.done_by, show_options: 'worker'}
        ];
    }

    $scope.print = function(){
      ModalService.show.modalFormDialog('Confirm service date',
          fields, function(model){
              if(model){
                  if(order){
                      if(!order.$save){
                        order = new OrderService(order);
                      }
                      if(service)
                      {
                        order.services[$stateParams.action].date = model.date;
                        order.services[$stateParams.action].done_by = model.done_by;
                      }else{
                        order.installation_date = model.date;
                        order.installation_by = model.done_by;
                      }

                      $scope.date = model.date;
                      $scope.done_by = model.done_by;
                      order.$save(function(savedResponse){
                          toaster.pop('success', "Service form sent to printer with success");
                          $window.print();
                          $window.history.back();
                      }, function(err) {
                          toaster.pop('error', "There was an error saving service on server, "+err.message);
                      });
                      return true;
                  }
                  return false;
              }
          })();

    };
  });
