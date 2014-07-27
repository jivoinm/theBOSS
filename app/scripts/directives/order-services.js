'use strict';

angular.module('theBossApp')
    .directive('orderServices', ['$rootScope', 'theBossSettings', function ($rootScope, theBossSettings) {
        return {
            template: '<quick-list quick-list="order.services" listType="list" title="List of services"' +
                '        list-fields-to-edit="order_service_fields" editable-form="order" broadcast-event="order-changed">' +
                '            <h4 class="list-group-item-heading">' +
                '                {{ item.details }}' +
                '                <span class="pull-right text-muted small"><em>Service Date:{{ item.date | timeago:true}}</em></span>' +
                '            </h4>' +
                '            <p class="list-group-item-text">To be done by: {{ item.done_by }}</p>' +
                '        </quick-list>',
            restrict: 'E',
            controller: function ($scope){
                $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                    $scope.preview = preview;
                });

                $scope.order_service_fields = [{title:'Service Date', type:'date', require: true}, {title:'Details', type:'textarea', require: true},{title:'Done By', type:'text', require: false}];
            },
            link: function postLink(scope, element, attrs) {
                if(!scope.order){
                    element.text('Missing order on the scope');
                    return;
                }
            }
        };
    }]);
