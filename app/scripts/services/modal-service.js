'use strict';

angular.module('theBossApp')
    .service('ModalService',['$modal','_', function ($modal,_) {
        var fieldsToModel = function(fields){

            var model = {};
            angular.forEach(fields, function(field){
                var fieldName = field.name || field.title;
                var fieldValue = field.value;
                var path = fieldName.toLowerCase().replace(' ','_').split('.');
                setProperty(model,path,fieldValue);
                field.value = null;
            });
            return model;
        }

        function setProperty(obj, keyPath, value) {
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
                    (callback || angular.noop)();
                });
            },

            showOrderDetailsPopup: function(title, order, callback){

                var modal = $modal.open({
                    width: "750px",
                    template: '<div class="modal-header"> <h5>'+title+'</h5> </div><div class="modal-body"><form class="form-horizontal"><order-details></order-details> </form> </div> <div class="modal-footer"> <button class="btn btn-warning" ng-click="close()" id="close">Close</button> </div>',
                    resolve: {
                        order: function(){return order;}
                    },
                    controller: function($scope, $modalInstance, order){
                        $scope.order = order;
                        $scope.preview = true;
                        $scope.close = function(){
                            $modalInstance.close();
                        }
                    }
                });

                modal.result.then(function () {
                    (callback || angular.noop)();
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
                            $modalInstance.dismiss();
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
