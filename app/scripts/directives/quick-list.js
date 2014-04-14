'use strict';

angular.module('theBossApp')
    .directive('quickList', function () {
        return {
            templateUrl: '/views/directive-templates/quick-list.html',
            restrict: 'E',
            scope: {
                list: '@'
            },
            link: function postLink(scope, element, attrs) {
            }
        };
    });
