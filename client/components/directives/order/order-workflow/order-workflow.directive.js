'use strict';

angular.module('theBossApp')
  .directive('orderWorkflow', function (ModalService, $rootScope, toaster, theBossSettings) {
    return {
        template: '<div class="btn-group btn-group-justified">' +
            '        <div class="btn-group" ng-show="showWorkflowAction(\'approved\')">' +
            '            <button type="button" class="btn btn-success" ng-click="setStatus(\'approved\')">Approve</button>' +
            '        </div>' +
            '        <div class="btn-group" ng-show="showWorkflowAction(\'blocked\')">' +
            '            <button type="button" class="btn btn-warning" ng-click="setStatus(\'blocked\')">Blocked</button>' +
            '        </div>' +
            '        <div class="btn-group" ng-show="showWorkflowAction(\'finished\')">' +
            '            <button type="button" class="btn btn-success" ng-click="setStatus(\'finished\')">Finished</button>' +
            '            </div>' +
            '  </div>'+
            '  <div class="btn-group btn-group-justified" ng-show="showWorkflowAction(\'reset\')"> '+
            '       <div class="btn-group">' +
            '            <button type="button" class="btn btn-danger" ng-click="setStatus(\'reset\')">Reset order status</button>' +
            '       </div>'+
            '  </div> '
            ,
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
                    case 'finished':
                        return false;
                    default:
                        return action === 'approved';
                }
                return false;
            }

            //Set order status
            scope.setStatus = function (status){
              console.log(scope.order);
                ModalService.confirm.question('You are about to '+status+' this order, are you sure?', function(confirmed){
                    if(confirmed){
                        status = status === 'reset' ? 'approved' : status;
                        scope.order.$setStatus({status:status}, function(order){
                            //$scope.order = order;
                            $rootScope.$broadcast(theBossSettings.orderChangedEvent,order);
                            toaster.pop('success', "Success", 'Updated status to '+ status);
                        },function(err){
                            toaster.pop('error', "Error", 'Error updating status '+ err);
                        });
                    }
                })();
            }
        }
    };
  });
