'use strict';

angular.module('theBossApp')
    .service('ModalService',['$modal', function ($modal) {
        var fieldsToModel = function(fields){
            var model = {};
            angular.forEach(fields, function(field){
                model[field.title.toLowerCase().replace(' ','_')] = field.value;
            });
            return model;
        }
        
        return {
            confirmDelete: function(question, callback){
                var modal = $modal.open({
                    template: '<div class="modal-header"> <h5>Need your confirmation</h5> </div><div class="modal-body"> <div class="alert alert-danger"> '+question+' </div> </div> <div class="modal-footer"> <button class="btn btn-danger" ng-click="ok()">Ok</button> <button class="btn btn-warning" ng-click="cancel()" id="cancel">Cancel</button> </div>',
                    controller: function($scope, $modalInstance){
                        $scope.ok = function(){
                            $modalInstance.close(true);
                        }
                        $scope.cancel = function(){
                            $modalInstance.close(false);
                        }
                    }
                });

                modal.result.then(function (confirmed) {
                    callback(confirmed);
                });
            },
            confirm: function(question, callback){
                var modal = $modal.open({
                    template: '<div class="modal-header"> <h5>Need your confirmation</h5> </div><div class="modal-body"> <div class="alert alert-info"> '+question+' </div> </div> <div class="modal-footer"> <button class="btn btn-success" ng-click="ok()">Ok</button> <button class="btn btn-warning" ng-click="cancel()" id="cancel">Cancel</button> </div>',
                    controller: function($scope, $modalInstance){
                        $scope.ok = function(){
                            $modalInstance.close(true);
                        }
                        $scope.cancel = function(){
                            $modalInstance.close(false);
                        }
                    }
                });

                modal.result.then(function (confirmed) {
                    callback(confirmed);
                });
            },

            showPopup: function(title, body, callback){
                var modal = $modal.open({
                    template: '<div class="modal-header"> <h5>'+title+'</h5> </div><div class="modal-body"> '+body+' </div> <div class="modal-footer"> <button class="btn btn-warning" ng-click="close()" id="close">Close</button> </div>',
                    controller: function($scope, $modalInstance){
                        $scope.close = function(){
                            $modalInstance.close();
                        }
                    }
                });

                modal.result.then(function () {
                    callback();
                });
            },

            modalFormDialog: function(title,fields, callback){
                var modal = $modal.open({
                    template: '<div class="modal-header"> <h5>'+title+'</h5> </div><div class="modal-body"><form role="form" class="form-horizontal">' +
                        '<div class="row"> ' +
                            '<div field ng-model="field.value" ng-field="field" ng-repeat="field in fields"></div>' +
                        '</div>' +
                        '</form> </div> <div class="modal-footer"> <button class="btn btn-success" ng-click="ok()">Ok</button> <button class="btn btn-warning" ng-click="cancel()" id="cancel">Cancel</button> </div>',
                    resolve:{
                        fields: function(){return fields;}
                    },
                    controller: function($scope, $modalInstance,fields){
                        $scope.fields = fields;
                        $scope.ok = function(){
                            $modalInstance.close(fields);
                        }
                        $scope.cancel = function(){
                            $modalInstance.close(null);
                        }
                    }
                });

                modal.result.then(function (fields) {
                    if(fields)
                    {
                        callback(fieldsToModel(fields));
                    }
                });
            }
            
            
        }
    }]);
