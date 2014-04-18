'use strict';

angular.module('theBossApp')
    .directive('quickList', function () {
        return {
            templateUrl: '/views/directive-templates/quick-list.html',
            restrict: 'E',
            scope: {
                quickList: '=',
                itemSelect: '&'
            },
            link: function (scope, element, attrs) {
                scope.title = attrs.title || "Quick list";
            }
        };
    });
