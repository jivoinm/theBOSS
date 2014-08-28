'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:messages
 * @description
 * # messages
 */
angular.module('theBossApp')
  .directive('messages', ['Message', 'OrderService', function (Message, OrderService) {
    return {
      templateUrl: '/views/directive-templates/messages.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
      	scope.messages = [];
        
        scope.loadMessages = function (){
          Message.New().$promise.then(function (messages) {
             scope.messages = messages;
          }, function (err) {
            console.log(err);
          });  
        }
      	scope.loadMessages();
      }
    };
  }]);
