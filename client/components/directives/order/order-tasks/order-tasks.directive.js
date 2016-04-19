'use strict';

angular.module('theBossApp')
  .directive('orderTasks', function ($rootScope, theBossSettings) {
    return {
        template: '<work-log order="order"></work-log>',
        restrict: 'E',
        controller: function ($scope){
            $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                $scope.preview = preview;
            });

            $scope.order_task_fields = [
              {title:'Title', type:'text', require: true},
              {title:'Duration', type:'text', require: true},
              {title:'Status Options', type:'textarea', require: true}];
        },

        link: function postLink(scope, element, attrs) {
            if(!scope.order){
                element.text('Missing order on the scope');
            }

            $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                scope.preview = preview;
            });
        }
    };
  });
