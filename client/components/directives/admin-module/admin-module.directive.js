'use strict';

angular.module('theBossApp').
directive('topNav',function () {
  return {
      restrict: 'E',

      templateUrl: 'components/directives/admin-module/top-nav.html',
      link: function (scope, elem, attrs) {
          scope.title = attrs.title;
      }
  };
}).
directive('accessories', ['OrderService','toaster', function (OrderService, toaster) {
  return {
      restrict: 'E',
      templateUrl: 'components/directives/admin-module/accessories.html',
      scope: false,
      link: function (scope) {
          scope.orders = [];
          scope.notreceived = {received:false};
          OrderService.accessories().$promise.then(function(data){
              scope.orders = data;
          });

          scope.saveUpdates = function(index,order,accessory) {
              if(accessory.items_received) {
                  accessory.received = accessory.items_received >= accessory.quantity;
                  accessory.date_received = new Date();
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
      }
  };
}]).
directive('tasks', function (OrderService, $location) {
  return {
      restrict: 'E',
      templateUrl: 'components/directives/admin-module/tasks.html',
      scope: true,
      controller: function ($scope) {
          if($scope.order){
              $scope.orders = [$scope.order];
          }else{
              OrderService.tasks({}).$promise.then(function(data){
                  $scope.orders = data;
              });
          }

          var selectedTab;

          $scope.setTaskStatus = function(order,orderIndex,form,formIndex,task,status, e){
              if (e) {
                  e.preventDefault();
                  e.stopPropagation();
              }
              task.changed_by = $scope.$root.currentUser._id;
              task.changed_on = new Date();
              task.status = status;

              //if all tasks are finished then remove from the list
              return order.$save(function(savedOrder){
                  order = savedOrder;
                  if(savedOrder.status === 'finished'){
                      $scope.orders.splice(orderIndex,1);
                  }else{
                      order.forms[formIndex].active = true;
                  }

              });
          };

          $scope.loadOrder = function(id){
              $location.path('/order/' + id);
          }

          $scope.status = {
              isFirstOpen: true,
              isFirstDisabled: false,
              oneAtATime: true
            };
      }
  };
}).
directive('shippingList', ['OrderService', '$timeout', 'toaster', function (OrderService, $timeout, toaster) {
  return {
      restrict: 'E',
      templateUrl: 'components/directives/admin-module/shipping-list.html',
      scope: true,
      controller: function ($scope) {
          $scope.orders = [];
          $scope.totalOrders = 0;
          $scope.currentPage = 1;
          $scope.maxSize = 10;

          $scope.loadOrders = function(){
              var query = {};
              query.limit = $scope.maxSize = 10;
              query.page = $scope.currentPage;

              OrderService.shippingList(query).$promise.then(function(data){
                  $scope.orders = data.orders;
                  $scope.currentPage = data.page;
                  $scope.totalOrders = data.totalOrders;
              });
          }
          if($scope.order){
              $scope.orders = [$scope.order];
          }else{
              $scope.loadOrders();
          }

          $scope.$watch('currentPage', function (pageNoNew, pageNoOld) {
              if(pageNoNew != pageNoOld){
                  console.log('shippingList currentPage changed');
                  $scope.loadOrders();
              }
          });
      }
  };
}])
.directive('shippingListItem', ['OrderService', '$timeout', 'toaster', 'ModalService', 'moment', 'theBossSettings', function (OrderService, $timeout, toaster, ModalService, moment, theBossSettings) {
  return {
      restrict: 'E',
      templateUrl: 'components/directives/admin-module/shipping-list-item.html',
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

          // Disable weekend selection
          $scope.disabled = function(date, mode) {
              return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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
              if (newValue != oldValue) {
                if (timeout) {
                  $timeout.cancel(timeout)
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
}]).
directive('alerts', ['$http', function ($http) {
  return {
      restrict: 'E',
      //replace: true,
      templateUrl: 'components/directives/admin-module/top-nav-alerts.html',
      link: function (scope, element, attrs) {
          if (!attrs.from) {
              throw new Error('Attribute "from" should be defined.')
          }

          scope.alerts = [];
          $http.get(attrs.from).success(function (data) {
              scope.alerts = data;
          });
      }
  };
}]).
directive('navUser',['Auth','$location', function (Auth, $location) {
  return {
      restrict: 'E',
      templateUrl: 'components/directives/admin-module/top-nav-user.html',
      link: function(scope){
          scope.logout = function () {
              Auth.logout()
                  .then(function () {
                      $location.path('/login');
                  });
          };
      }
  };
}]).

directive('sbSidebar',function () {
  return {
      restrict: 'E',
      //replace: true,
      templateUrl: 'components/directives/admin-module/sidebar.html'
  };
}).
directive('sbSidebarSearch',function () {
  return {
      restrict: 'E',
      //replace: true,
      templateUrl: 'components/directives/admin-module/sidebar-search.html'
  };
}).
directive('sbSidebarMenus', ['$http', '$timeout','Auth', function ($http, $timeout,Auth) {
  return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element, attrs) {
          if (!attrs.menusUrl) {
              throw new Error('Attribute "menus-url" should be defined.')
          }

          scope.menus = [];

          $http.get(attrs.menusUrl).success(function (data) {
              scope.menus = data;
          });
      }
  };
}]).
directive('sbDatatables',function () {
  return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element) {
          element.dataTable();
      }
  };
}).
directive('sbTooltip',function () {
  return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element) {
          element.tooltip({
              selector: "[data-toggle=tooltip]",
              container: "body"
          });
      }
  };
}).
directive('sbPopover', function () {
  return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element) {
          element.find('[data-toggle=popover]').popover();
      }
  };
}).

directive('sbUrlActive',['$location', function ($location) {
  return{
      restrict: 'A',
      link: function (scope, element) {
          if(element[0].hash){
              var path = element[0].hash.replace('#','');
              if($location.path() ===  path){
                  element.addClass('active');
              }else{
                  element.removeClass('active');
              }
          }
      }
  }

}]).
directive('sbUrlActiveMenu',['$location', function ($location) {
  return{
      restrict: 'A',
      link: function (scope, element) {
          if(element[0].hash){
              var path = element[0].hash.replace('#','');
              console.log($location.path(), element.parent());
              if($location.path() ===  path){
                  element.parent().addClass('active');
              }else{
                  element.parent().removeClass('active');
              }
          }
      }
  }

}]);
