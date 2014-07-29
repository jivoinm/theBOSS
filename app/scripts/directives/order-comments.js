'use strict';

angular.module('theBossApp')
    .directive('orderComments', ['$rootScope', 'theBossSettings', function ($rootScope, theBossSettings) {
        return {
            template: '<quick-list quick-list="order.comments" listType="list" title="Comments"' +
                '        list-fields-to-edit="order_comment_fields" editable-form="order" broadcast-event="order-changed">' +
                '            <div class="chat-body clearfix">' +
                '                <div class="header">' +
                '                    <strong class="primary-font">{{ item.from.name }}</strong>' +
                '                    <small class="pull-right text-muted">' +
                '                        <i class="fa fa-clock-o fa-fw"></i> {{ item.created_on | timeago}}' +
                '                    </small>' +
                '                </div>' +
                '                <p>' +
                '                            {{ item.message }}' +
                '                </p>' +
                '            </div>' +
                '            </quick-list>',
            restrict: 'E',
            controller: function ($scope){
                $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                    $scope.preview = preview;
                });

                $scope.order_comment_fields = [{title:'Message', type:'text', require: true, focus:true}, {title:'from.user_id', type:'hidden', value: $rootScope.currentUser.user_id}, {title:'from.name', type:'hidden', value: $rootScope.currentUser.name}, {title:'from.email', type:'hidden', value: $rootScope.currentUser.email}];
            },
            link: function postLink(scope, element, attrs) {
                if(!scope.order){
                    element.text('Missing order on the scope');
                    return;
                }
            }
        };
    }]);
