'use strict';

angular.module('theBossApp')
    .directive('orderStatus', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                element.html('<span class="label" ng-class="{\'label-default\':order.status === \'New\', \'label-success\':order.status === \'Finished\'}">{{ order.status }}</span>');
                scope.$watch('order', function (order, oldOrder) {
                    if(order != oldOrder){
                        console.log('order changed',order, oldOrder);
                        $compile(element)(scope);
                    }
                })
            }
        };
    }]);
