'use strict';

angular.module('theBossApp')
  .factory('ModalService', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          fields: function () {
            return scope.fields;
          },
          callback: function (){
            return scope.callback;
          }
        },
        windowClass: modalClass,
        scope: modalScope
      });
    }

    function camelCase(input) {
      return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
          return group1.toUpperCase();
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },

        /**
         * Create a function to open a confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        question: function(question, callback) {
          callback = callback || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to callback callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                confirmationModal;
            var confirmed = false;
            confirmationModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm',
                html: '<p><strong>' + question + '</strong></p>',
                buttons: [{
                  classes: 'btn-success',
                  text: 'Yes',
                  click: function(e) {
                    confirmed = true;
                    confirmationModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'No',
                  click: function(e) {
                    confirmationModal.close(e);
                  }
                }]
              }
            });

            confirmationModal.result.then(function(event) {
              callback(confirmed);
            });
          };
        }
      },
      show :{
        showPopup: function(title, body, callback){
            callback = callback || angular.noop;
            return function (){
              var modal = openModal({
                  modal: {
                    title: title,
                    html: body,
                    buttons: [{
                      classes: 'btn-default',
                      text: 'Close',
                      click: function (e){
                        modal.dismiss(e);
                        callback();
                      }
                    }]
                  }
              }, 'modal');

              modal.result.then(function () {
                  (callback || angular.noop)();
              });
            };
          },

          showOrderDetailsPopup: function(title, order, activeTab, callback){
            callback = callback || angular.noop;
            return function (){
                var modal = $modal.open({
                     size: 'lg',
                     template: '<div class="modal-header"> <h5>'+title+'</h5> </div><div class="modal-body"><form class="form-horizontal"><order-preview order="order" modal="true" active-tab="tab"></order-preview> </form> </div> <div class="modal-footer"> <button class="btn btn-warning" ng-click="close()" id="close">Close</button> </div>',
                     resolve: {
                         order: function(){
                           return order;
                         },
                         tab: function(){
                           return activeTab;
                         }
                     },
                     controller: function($scope, $modalInstance, order, tab){
                         $scope.order = order;
                         $scope.tab = tab;
                         $scope.preview = true;
                         $scope.close = function(){
                            $modalInstance.close();
                         }
                     }
                 });

                 modal.result.then(function () {
                     (callback || angular.noop)();
                 });
                 return modal;
               };
          },

          modalFormDialog: function(title,fields, callback){
              callback = callback || angular.noop;
              return function (){
              var modal = openModal({
                  fields: fields,
                  callback: callback,
                  modal: {
                    title: title,
                    form: true
                  }
                }, 'modal');

            };
          }
      }
    };
  })

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, fields, callback) {
  $scope.fields = fields;

  $scope.ok = function () {
    if(fields)
    {
        if(callback($scope.fieldsToModel(fields))){
            $modalInstance.close($scope.fields);
            $scope.fields.forEach(function(field){
              field.value = null;
            });
        }
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.fieldsToModel = function(fields){
      var model = {};
      angular.forEach(fields, function(field){
          var fieldName = field.name || field.title;
          var fieldValue = field.value;
          var path = fieldName.toLowerCase().replace(' ','_').split('.');
          $scope.setProperty(model,path,fieldValue);
      });
      return model;
  }

  $scope.setProperty = function(obj, keyPath, value) {
          var i = 0,
              len = keyPath.length - 1;
          for (; i < len; i++) {
              if(!obj[keyPath[i]]){
                  obj[keyPath[i]] = {};
              }
              obj = obj[keyPath[i]];
          }
          obj[keyPath[i]] = value;
      }

});
