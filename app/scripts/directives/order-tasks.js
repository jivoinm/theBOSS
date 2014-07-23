'use strict';

angular.module('theBossApp')
    .directive('orderTasks', ['$rootScope', 'theBossSettings', function ($rootScope, theBossSettings) {
        return {
            template: '<tasks order="order"></tasks>',
            restrict: 'E',

            link: function postLink(scope, element, attrs) {
                if(!scope.order){
                    element.text('Missing order on the scope');
                }

                $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                    scope.preview = preview;
                });

                //scope.order_task_fields = [{title:'Title', type:'text', require: true},{title:'Duration', type:'text', require: true},{title:'Status Options', type:'textarea', require: true}];
            }
        };
    }]);
