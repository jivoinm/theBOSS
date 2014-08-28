'use strict';

angular.module('theBossApp')
  .directive('message', ['Message', 'OrderService', function (Message, OrderService) {
    return {
      templateUrl: '/views/directive-templates/message.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.message = {};
        scope.saveMessage = function (isValid){
          if(isValid && scope.message.order && scope.message.content) {
            var message = new Message(scope.message);
            message.$save(function (res){
              scope.message = {};
              scope.loadMessages();
            });
          }
        }

        scope.loadOrders = function(val) {
          return OrderService.query({text:val, limit:10}).$promise.then(function(res){
            var orders = [];
            scope.message.order = null;
            angular.forEach(res.orders, function(item){
              orders.push(item);
            });
            return orders;
          });
        };

        scope.selectedOrder = function(item, model, label){
            scope.message.order = item._id;
        }
      }
    };
  }]);
