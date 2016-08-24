'use strict';

angular.module('theBossApp')
  .directive('notes', function (Note, OrderService) {
    return {
      templateUrl: 'components/directives/notes/notes.html',
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
      	scope.notes = [];

        scope.loadNotes = function (){
          Note.New().$promise.then(function (notes) {
             scope.notes = notes;
          }, function (err) {
            console.log(err);
          });
        };
      	scope.loadNotes();
      }
    };
  });
