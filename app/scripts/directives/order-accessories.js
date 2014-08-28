'use strict';

angular.module('theBossApp')
    .directive('orderAccessories', ['$rootScope', 'theBossSettings', function ($rootScope, theBossSettings) {
        return {
            template: ' <quick-list quick-list="order.ordered_accessories" listType="list" title="Ordered Accessories"' +
                '            list-fields-to-edit="order_accessories_fields" editable-form="order" broadcast-event="order-changed">' +
                '                <h4 class="list-group-item-heading">' +
                '                {{ item.from_manufacturer }}' +
                '                    <span class="pull-right text-muted small"><em>Received:{{ item.date_received | timeago}}</em></span>' +
                '                </h4>' +
                '                <p class="list-group-item-text">{{ item.description }}</p>' +
                '</quick-list>',
            restrict: 'E',
            controller: function ($scope){
                $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                    $scope.preview = preview;
                });

                $scope.order_accessories_fields = [{title:'From Manufacturer', type:'text', require: true, value:''},
                {title:'Description', type:'text', require: true}, {title:'Quantity', type:'number', require: true}
                ];
            },
            link: function postLink(scope, element, attrs) {
                if(!scope.order){
                    element.text('Missing order on the scope');
                    return;
                }
            }
        };
    }]);
