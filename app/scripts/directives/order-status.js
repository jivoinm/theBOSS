'use strict';

angular.module('theBossApp')
    .directive('orderStatus', ['$rootScope', function ($rootScope) {
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
                    if(status.toLowerCase() === 'finished'){
                        span.attr('class', 'label label-success');
                    }else if(status.toLowerCase() === 'in progress'){
                        span.attr('class', 'label label-primary');
                    }else if(status.toLowerCase() === 'blocked'){
                        span.attr('class', 'label label-warning');
                    }else if(status.toLowerCase() === 'new'){
                        span.attr('class', 'label label-warning');
                    }else {
                        span.attr('class', 'label label-default');
                    }
                }
            }
        };
    }]);
