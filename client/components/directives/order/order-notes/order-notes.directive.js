'use strict';

angular.module('theBossApp')
  .directive('orderNotes', function (Note, ModalService, toaster, Auth) {
    return {
      templateUrl: 'components/directives/order/order-notes/order-notes.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.notes = [];
      	if(!scope.order){
          element.text('Missing order on the scope');
      		return;
      	}

      	Note.OrderNotes({orderid: scope.order._id}).$promise.then(function (notes) {
      		scope.notes = notes;
      	});

        scope.order_note_fields = [
            {title:'Content', type:'textarea', require: true}
        ];

      	scope.resolved = function (note){
      		note.$save({},function (msg){
            note.resolved = true;
          }, function(err){
              //error
              console.log(err);
              note.resolved = false;
          });
      	};

        scope.addNewNote = function(){
            ModalService.show.modalFormDialog('Add new Note',
                scope.order_note_fields, function(model){
                    if(model){
                        model = new Note(model);
                        model.order = scope.order._id;
                        model.$save(function(savedResponse){
                            toaster.pop('success', 'Note was saved with success');
                            scope.notes.push(savedResponse);
                        }, function(err) {
                            toaster.pop('error', 'There was an error saving note on server, '+err.message);
                        });
                      model = null;
                      return true;
                    }
                })();

        };


        scope.deleteNote = function ($index, note){
          var question = 'Are you sure you want to delete this note?';
          ModalService.confirm.question(question, function(confirm){
            if(confirm){
              note.$delete(function(){
                scope.notes.splice($index,1);
              });
            }
          })();

        };
      }
    };
  });
