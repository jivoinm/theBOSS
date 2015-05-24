'use strict';

angular.module('theBossApp')
  .directive('orderStatus', function ($rootScope, theBossSettings) {
    return {
        template: '<span class="label"></span>',
        restrict: 'E',
        link: function postLink(scope, element) {

            $rootScope.$on(theBossSettings.orderChangedEvent, function (event, order) {
                var status = order.status || 'new';
                scope.setLabelClass(status);
                console.log('orderStatus changed event', status);
            });

            scope.setLabelClass = function (status){
                var span = element.find('span');
                span.text(status);
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
            }

            if(scope.order){
              scope.setLabelClass(scope.order.status);
            }

            if(scope.item){
              scope.setLabelClass(scope.item.status);
            }
        }
    };
  });
