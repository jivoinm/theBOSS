'use strict';

angular.module('theBossApp')
  .directive('orderWorkflow', function (ModalService, $rootScope, toaster, theBossSettings, $location, Auth) {
    return {
        template: '<div class="btn-group btn-group-justified">' +
            '        <div class="btn-group" ng-if="showWorkflowAction(\'approved\')">' +
            '            <button type="button" class="btn btn-success" ng-click="setStatus(\'approved\')">Approve</button>' +
            '        </div>' +
            '        <div class="btn-group" ng-if="showWorkflowAction(\'blocked\')">' +
            '            <button type="button" class="btn btn-warning" ng-click="setStatus(\'blocked\')">Blocked</button>' +
            '        </div>' +
            '        <div class="btn-group" ng-if="showWorkflowAction(\'finished\')">' +
            '            <button type="button" class="btn btn-success" ng-click="setStatus(\'finished\')">Finished</button>' +
            '            </div>' +
            '  </div>'+
            '  <div class="btn-group btn-group-justified" ng-if="showWorkflowAction(\'reset\')"> '+
            '       <div class="btn-group">' +
            '            <button type="button" class="btn btn-danger" ng-click="setStatus(\'reset\')">Reset order status</button>' +
            '       </div>'+
            '  </div> ',
        restrict: 'E',
        scope: {
            order: '='
        },
        link: function postLink(scope, element, attrs) {
            if(!scope.order){
                element.text('orderWorkflow - Missing order on the scope');
                return;
            }

            scope.showWorkflowAction = function (action){
                switch(scope.order.status ? scope.order.status.toLowerCase() : '') {
                    case 'approved':
                        return action === 'blocked' || action === 'finished';
                    case 'in progress':
                        return action === 'blocked' || action === 'finished' || action === 'reset';
                    case 'blocked':
                        return action === 'approved' || action === 'finished' || action === 'reset';
                    case 'finished' :
                        return action === 'reset';
                    default:
                        return action === 'approved';
                }
                return false;
            };

            //Set order status
            scope.setStatus = function (status){
                ModalService.confirm.question('You are about to '+status+' this order, are you sure?', function(confirmed){
                    if(confirmed){
                      var oldStatus = scope.order.status;
                      if(status==='reset'){
                        scope.updateOrderTaskStatus(status);
                        status = status === 'reset' ? 'approved' : status;
                        scope.order.status = status;
                        scope.order.$save(function(order){
                          scope.order = order;
                          $rootScope.$broadcast(theBossSettings.orderChangedEvent,order);
                        });
                      } else {
                        scope.updateOrderTaskStatus(status);
                        scope.order.status = status;
                        scope.order.$save(function(order){
                          scope.order = order;
                          if(oldStatus==='new'){
                            //redirect to main page
                            $location.path('/');
                          }
                          $rootScope.$broadcast(theBossSettings.orderChangedEvent,order);
                          toaster.pop('success', "Success", 'Updated status to '+ status)
                        }, function(err){
                            toaster.pop('error', "Error", 'Error updating status '+ err);
                        });
                    }
                  }
                })();
            };

            scope.updateOrderTaskStatus = function(status){
              for (var i = 0; i < scope.order.forms.length; i++) {
                for (var j = 0; j < scope.order.forms[i].tasks.length; j++) {
                    var task = scope.order.forms[i].tasks[j];
                    if(status === 'reset'){
                      delete task['changed_by'];
                      delete task['changed_on'];
                      delete task['status'];
                    }else{
                      task['changed_by'] = Auth.getCurrentUser()._id;;
                      task['changed_on'] = new Date();
                      task['status'] = 'done';
                    }

                    scope.order.forms[i].tasks[j] = task;
                }
              }

            };
        }
    };
  });
