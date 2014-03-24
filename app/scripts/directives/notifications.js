'use strict';

angular.module('theBossApp')
    .directive('topNavMessages', ['Message',function (Message) {
        return {
            templateUrl: '/views/directive-templates/messages.html',
            restrict: 'E',
            link: function (scope, element, attrs) {
                if(scope.currentUser){
                    Message.get({userName: scope.currentUser.email},function(data){
                        console.log(data);
                        scope.messages = data;
                    });
                }
            }
        };
    }]);
