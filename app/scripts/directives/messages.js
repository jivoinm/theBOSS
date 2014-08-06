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
        scope.message = {};
        scope.loadMessages = function (){
          Message.New().$promise.then(function (messages) {
             scope.messages = messages;
          }, function (err) {
            console.log(err);
          });  
        }
      	

        scope.saveMessage = function (isValid){
          if(isValid) {
            var message = new Message(scope.message);
            message.$save(function (res){
              scope.message = {};
              scope.loadMessages();
            });
          }
        }

        scope.loadOrders = function(val) {
          return OrderService.query({text:val}).$promise.then(function(res){
            var orders = [];
            angular.forEach(res.orders, function(item){
              orders.push(item);
            });
            return orders;
          });
        };

        scope.selectedOrder = function(item, model, label){
            scope.message.order = item._id;
        }

        scope.loadMessages();
      }
    };
  }]);
