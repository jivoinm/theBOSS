'use strict';

angular.module('theBossApp')
    .directive('formBuilder', ['$http','$compile','$rootScope', function ($http,$compile,$rootScope) {


        return {
            template: '<field ng-repeat="field in project.fields track by $index"></field>',
            restrict: 'E',



            link: function ($scope, element) {
                // element will be the div which gets the ng-model on the original directive
                var fields = element.attr('fields');
                var model= element.attr('model');
                //$scope.model = $scope.$eval(model);
                //$scope.formFields = $scope.$eval(fields);

            }

        };
    }]);
