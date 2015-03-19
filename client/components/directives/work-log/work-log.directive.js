'use strict';

angular.module('theBossApp')
  .directive('workLog', function (OrderService, $location, Auth, $sce, $filter) {
    return {
      templateUrl: 'components/directives/work-log/work-log.html',
      restrict: 'EA',
      scope: true,
      link: function (scope) {
        scope.totalOrders = 0;
        scope.currentPage = 1;
        scope.maxSize = 10;
        scope.loadTasks = function(){
            var query = {};
            query.limit = scope.maxSize = 10;
            query.page = scope.currentPage;

            OrderService.tasks(query).$promise.then(function(data){
                scope.orders = data.orders;
                scope.currentPage = data.page;
                scope.totalOrders = data.totalOrders;
            });
        };

        if(scope.order){
            scope.orders = [scope.order];
        }else{
            scope.loadTasks();
        }

        var selectedTab;

        scope.setTaskStatus = function(order,orderIndex,form,formIndex,task,status, e){
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            task.changed_by = Auth.getCurrentUser()._id;
            task.changed_on = new Date();
            task.status = status;

            //if all tasks are finished then remove from the list
            return order.$save(function(savedOrder){
                order = savedOrder;
                if(savedOrder.status === 'finished'){
                    scope.orders.splice(orderIndex,1);
                }else{
                    order.forms[formIndex].active = true;
                }

            });
        };

        scope.loadOrder = function(id){
            $location.path('/order/' + id);
        }

        scope.getOrderTitle = function(order){
          if(order && order.customer)
          {
            var dateRequired = $filter('date')(order.date_required);
            return $sce.trustAsHtml('Customer:'+ order.customer.name +' - '+ order.po_number +' @ '+ dateRequired);
          }
          return '';
        };

        scope.$watch('currentPage', function (pageNoNew, pageNoOld) {
            if(pageNoNew != pageNoOld){
              scope.loadTasks();
            }
        });
      }
    };
  });
