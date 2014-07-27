'use strict';

angular.module('theBossApp')
    .directive('orderDetails', ['$rootScope', function ($rootScope) {
        return {
            templateUrl: '/views/directive-templates/order-details.html',
            restrict: 'E',
            scope: {
                order: '='
            },
            link: function (scope) {
            }
        };
    }]);
