'use strict';

angular.module('theBossApp')
    .directive('orderComments', ['$rootScope', 'theBossSettings', 'OrderService', function ($rootScope, theBossSettings, OrderService) {
        return {
            template: '<quick-list quick-list="comments" listType="list" title="Comments"' +
                '        list-fields-to-edit="order_comment_fields" editable-form="order" broadcast-event="order-changed">' +
                '            <div class="chat-body clearfix">' +
                '                <div class="header">' +
                '                    <strong class="primary-font">{{ item.from.name }}</strong> <a href="#/order/{{ item._id }}" ng-if="item._id">Load order</a>' +
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

                $scope.order_comment_fields = [
                    {title:'Message', type:'text', require: true, focus:true},
                    {name:'from.user_id', type:'hidden', value: $rootScope.currentUser.user_id},
                    {name:'from.name', type:'hidden', value: $rootScope.currentUser.name},
                    {name:'created_on', type:'hidden', value: new Date()},
                    {name:'from.email', type:'hidden', value: $rootScope.currentUser.email}];
            },
            link: function postLink(scope, element, attrs) {
                if(!scope.order){
                    OrderService.comments().$promise.then(function(data){
                        scope.comments = data.length>0 ? data: [];
                    })
                } else {
                    scope.comments = scope.order.comments;
                }
            }
        };
    }]);
