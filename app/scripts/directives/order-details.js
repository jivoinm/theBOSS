'use strict';

angular.module('theBossApp')
    .directive('orderDetails', ['$rootScope', function ($rootScope) {
        return {
            templateUrl: '/views/directive-templates/order-details.html',
            restrict: 'E',

            link: function (scope, element, attrs) {
                scope.order_search_fields = [{query:'customer', label:'Customer', api:'/api/customer'},{query:'created_by', label:'Created By', api:'/api/users'},{query:'projects.fields', label:'Projects'}];
                scope.order_task_fields = [{title:'Title', type:'text', require: true},{title:'Duration', type:'text', require: true},{title:'Status Options', type:'textarea', require: true}];
                scope.order_accessories_fields = [{title:'From Manufacturer', type:'text', require: true, value:''},{title:'Description', type:'text', require: true}, {title:'Quantity', type:'number', require: true},{title:'Received', type:'checkbox', require: false},{title:'Date Received', type:'date', require: false}];
                scope.order_service_fields = [{title:'Service Date', type:'date', require: true}, {title:'Details', type:'textarea', require: true},{title:'Done By', type:'text', require: false}];
                scope.order_comment_fields = [{title:'message', type:'text', require: true}, {title:'from.user_id', type:'hidden', value: $rootScope.currentUser.user_id}, {title:'from.name', type:'hidden', value: $rootScope.currentUser.name}, {title:'from.email', type:'hidden', value: $rootScope.currentUser.email}];
                scope.preview = attrs.preview || scope.$parent.preview;

                $rootScope.$on('order-changed', function (event,order) {
                    scope.order = order;
                });

            }
        };
    }]);
