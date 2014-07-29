'use strict';

angular.module('theBossApp')
    .directive('orderWorkflow', ['ModalService', '$rootScope', 'toaster', 'theBossSettings', function (ModalService, $rootScope, toaster, theBossSettings) {
        return {
            template: '<div class="btn-group btn-group-justified">' +
                '          <div class="btn-group">' +
                '        <button type="button" class="btn btn-success" ng-click="setStatus(\'approved\')">Approve</button>' +
                '        </div>' +
                '        <div class="btn-group">' +
                '            <button type="button" class="btn btn-warning" ng-click="setStatus(\'blocked\')">Blocked</button>' +
                '        </div>' +
                '        <div class="btn-group">' +
                '            <button type="button" class="btn btn-success" ng-click="setStatus(\'finished\')">Finished</button>' +
                '            </div>' +
                '        </div>',
            restrict: 'E',
            scope: {
                order: '='
            },
            link: function postLink(scope, element, attrs) {
                if(!scope.order){
                    element.text('orderWorkflow - Missing order on the scope');
                    return;
                }
                //Set order status
                scope.setStatus = function (status){
                    ModalService.confirm('You are about to '+status+' this order, are you sure?', function(confirmed){
                        if(confirmed){
                            scope.order.$setStatus({status:status}, function(order){
                                //$scope.order = order;
                                $rootScope.$broadcast(theBossSettings.orderChangedEvent,order);
                                toaster.pop('success', "Success", 'Updated status to '+ status);
                            },function(err){
                                toaster.pop('error', "Error", 'Error updating status '+ err);
                            });
                        }
                    })
                }
            }
        };
    }]);
