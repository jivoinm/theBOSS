'use strict';

angular.module('theBossApp')
  .directive('orderStatus', function ($rootScope, theBossSettings) {
    return {
        template: '<span class="label">{{status}} @ {{lastUpdatedOn | date}}</span>',
        restrict: 'E',
        link: function postLink(scope, element) {

            $rootScope.$on(theBossSettings.orderChangedEvent, function (event, order) {
                var status = order.status || 'new';
                scope.setLabelClass(status);
            });

            scope.setLabelClass = function (status){
                var span = element.find('span');
                status = status || 'new';
                scope.status = status;
                if(status.toLowerCase() === theBossSettings.taskStatuses.Finished){
                    span.attr('class', 'label label-success');
                }else if(status.toLowerCase() === theBossSettings.taskStatuses.InProgress){
                    span.attr('class', 'label label-primary');
                }else if(status.toLowerCase() === theBossSettings.taskStatuses.Blocked){
                    span.attr('class', 'label label-danger');
                }else if(status.toLowerCase() === theBossSettings.taskStatuses.New){
                    span.attr('class', 'label label-warning');
                }else {
                    span.attr('class', 'label label-default');
                }
            };

            scope.getLastTaskChangedDate = function(order){
              scope.lastUpdatedOn = order.last_updated_on;
            };

            if(scope.order){
              scope.setLabelClass(scope.order.status);
              scope.getLastTaskChangedDate(scope.order);
            }

            if(scope.item){
              scope.setLabelClass(scope.item.status);
              scope.getLastTaskChangedDate(scope.item);
            }
        }
    };
  });
