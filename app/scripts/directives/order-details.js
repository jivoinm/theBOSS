'use strict';

angular.module('theBossApp')
    .directive('orderDetails', ['$rootScope', function ($rootScope) {
        return {
            templateUrl: '/views/directive-templates/order-details.html',
            restrict: 'E',

            link: function (scope, element, attrs) {
                $rootScope.$on('order-changed', function (event,order) {
                    scope.order = order;
                });
            }
        };
    }]);
