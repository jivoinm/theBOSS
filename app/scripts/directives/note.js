'use strict';

angular.module('theBossApp')
  .directive('note', ['Note', 'OrderService', function (Note, OrderService) {
    return {
      templateUrl: '/views/directive-templates/note.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.note = {};
        scope.saveNote = function (isValid){
          if(isValid && scope.note.order && scope.note.content) {
            var note = new Note(scope.note);
            note.$save(function (res){
              scope.note = {};
              scope.loadNotes();
            });
          }
        }

        scope.loadOrders = function(val) {
          return OrderService.query({text:val, limit:10}).$promise.then(function(res){
            var orders = [];
            scope.note.order = null;
            angular.forEach(res.orders, function(item){
              orders.push(item);
            });
            return orders;
          });
        };

        scope.selectedOrder = function(item, model, label){
            scope.note.order = item._id;
        }
      }
    };
  }]);
