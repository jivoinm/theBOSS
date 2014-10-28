'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:orderNotes
 * @description
 * # orderNotes
 */
angular.module('theBossApp')
  .directive('orderNotes', ['Note', function (Note) {
    return {
      templateUrl: '/views/directive-templates/order-notes.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.notes = [];
      	if(!attrs.orderid){
      		return;
      	}
      	
      	Note.OrderNotes({orderid: attrs.orderid}).$promise.then(function (notes) {
      		scope.notes = notes;
      	})
      	
      	scope.resolved = function (note){
      		note.$save({},function (msg){
            console.log(msg);

            note.resolved = true;
          }, function(err){
              //error
              console.log(err);
              note.resolved = false;
          });
      	}

        scope.deleteNote = function ($index, note){
          note.$delete(function(){
              scope.notes.splice($index,1);
          })
        }
      }
    };
  }]);
