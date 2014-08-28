'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:orderMessages
 * @description
 * # orderMessages
 */
angular.module('theBossApp')
  .directive('orderMessages', ['Message', function (Message) {
    return {
      templateUrl: '/views/directive-templates/order-messages.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.messages = [];
      	if(!attrs.orderid){
      		return;
      	}
      	
      	Message.OrderMessages({orderid: attrs.orderid}).$promise.then(function (messages) {
      		scope.messages = messages;
      	})
      	
      	scope.resolved = function (message){
      		message.$save({},function (msg){
            console.log(msg);

            message.resolved = true;
          }, function(err){
              //error
              console.log(err);
              message.resolved = false;
          });
      	}
      }
    };
  }]);
