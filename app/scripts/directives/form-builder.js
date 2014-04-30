'use strict';

angular.module('theBossApp')
    .directive('formBuilder', ['$http','$compile','$rootScope', function ($http,$compile,$rootScope) {


        return {
            template: '<field ng-repeat="field in field_set.fields track by $index"></field>',
            restrict: 'E'

        };
    }]);
