'use strict';

angular.module('theBossApp')
    .directive('orderPreview', ['$filter', function ($filter) {

        return {
            templateUrl: '/views/directive-templates/order-preview.html',
            restrict: 'E',
            scope:{
                order:'='
            },
            controller: function($scope){
                $scope.preview = true;

            }
        };
    }]);
