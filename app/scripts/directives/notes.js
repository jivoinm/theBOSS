'use strict';

/**
 * @ngdoc directive
 * @name theBossApp.directive:notes
 * @description
 * # notes
 */
angular.module('theBossApp')
  .directive('notes', ['Note', 'OrderService', function (Note, OrderService) {
    return {
      templateUrl: '/views/directive-templates/notes.html',
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
        }
      	scope.loadNotes();
      }
    };
  }]);
