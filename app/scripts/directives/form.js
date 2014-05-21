'use strict';

angular.module('theBossApp')
    .directive('forms', ['FormService', '$modal', 'toaster', function (FormService, $modal, toaster) {
        return {
            templateUrl: '/views/directive-templates/form/form.html',
            restrict: 'E',
            scope: {
                listOfForms: '='
            },

            link: function (scope, element, attrs) {
                scope.module = attrs.module;
                scope.errors = [];
                scope.moduleForms = [];
                scope.addForm = function (form){
                    scope.listOfForms = scope.listOfForms || [];
                    scope.listOfForms.push(angular.copy(form));
                }

                function ShowFieldModal(field,form) {
                    var modalInstance = $modal.open({
                        templateUrl: '/views/directive-templates/form/field-setup.html',
                        controller: 'FieldEditCtrl',
                        resolve: {
                            form: function (){
                                return form;
                            },
                            field: function () {
                                return field;
                            },
                            module: function(){
                                return scope.module;
                            }

                        }
                    });
                    modalInstance.result.then(function (selectedField) {
                        if (selectedField) {
                            form.fields.push(selectedField);
                        }
                    });
                }

                scope.addField = function (form,e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    console.log('addField',form);
                    var field = ShowFieldModal({},form);
                    var field_set = form.field_set || [];
                    field_set.push(field);
                }

                if(scope.module){
                    //load forms for this module
                    FormService.get({module: scope.module}).$promise.then(function(res){
                        scope.moduleForms = res;
                    },function(err){
                        scope.errors.push(err.message? err.message : err);
                    });
                }
            }
        };
    }]);

angular.module('theBossApp')
    .controller('FieldEditCtrl', ['$scope', '$modalInstance', 'field', 'form', 'module', 
                                  'FormService', 'toaster', function($scope, $modalInstance, field, form, module, FormService,toaster){
        $scope.selectedfield = field;
        $scope.field_types = [
            {
                name : 'text',
                value : 'Text Field',
                actions: [
                    {
                        name: 'Add formula',
                        callback: 'calculate'
                    }
                ]
            },
            {
                name : 'email',
                value : 'E-mail'
            },
            {
                name : 'password',
                value : 'Password'
            },
            {
                name : 'radio',
                value : 'Radio Buttons'
            },
            {
                name : 'dropdown',
                value : 'Dropdown List',
                actions: [
                    {
                        name: 'Depends on',
                        callback: 'updateSelected'
                    }
                ]
            },
            {
                name : 'date',
                value : 'Date'
            },
            {
                name : 'textarea',
                value : 'Text Area'
            },
            {
                name : 'checkbox',
                value : 'Checkbox'
            },
            {
                name : 'hidden',
                value : 'Hidden'
            },
            {
                name : 'composite',
                value : 'Composite Element'
            }
        ];

        $scope.alerts = [];

        // add new option to the field
        $scope.addOption = function (field){
            field.show_options = field.show_options || [];

            var lastOptionID = 0;

            if(field.show_options[field.show_options.length-1])
                lastOptionID = field.show_options[field.show_options.length-1].id;

            // new option's id
            var option_id = lastOptionID + 1;

            var newOption = {
                "id" : option_id,
                "value" : "Option " + option_id,
                "color" : ""
            };

            // put new option into field_options array
            field.show_options.push(newOption);
        }

        // delete particular option
        $scope.deleteOption = function (field, option){
            for(var i = 0; i < field.show_options.length; i++){
                if(field.show_options[i].id == option.id){
                    field.show_options.splice(i, 1);
                    break;
                }
            }
        }


        // decides whether field options block will be shown (true for dropdown and radio fields)
        $scope.showAddOptions = function (field){
            if(field && (field.type === "radio" || field.type === "dropdown"))
                return true;
            else
                return false;
        }

        $scope.IsComposite = function(field){
            if(field && (field.type === "composite")){
                return true;
            }
            return false;
        }

        $scope.ok = function () {
            //validate the form here
            console.log('ok clicked');
            //add new field
            FormService.addField({id: form._id}, {field_set: $scope.field_set, field:$scope.selectedfield} ).$promise.then(function(res){
                toaster.pop('success', "New field was added with success");
                $modalInstance.close($scope.selectedfield);
            },function(err){
                toaster.pop('error', "There was an error saving new field on server, "+err);
            });
            
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);