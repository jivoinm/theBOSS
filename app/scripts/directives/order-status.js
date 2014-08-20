'use strict';

angular.module('theBossApp')
    .directive('orderStatus', ['$rootScope','theBossSettings', function ($rootScope, theBossSettings) {
        return {
            template: '<span class="label"></span>',
            restrict: 'E',
            link: function postLink(scope, element) {

                scope.$watch('order.status',function (newStatus){
                    var status = newStatus|| 'new';
                    scope.setLabelClass(status);
                })

                $rootScope.$on('order-changed', function (event, order) {
                    var status = order.status || 'new';
                    scope.setLabelClass(status);
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
            }
        };
    }]);
