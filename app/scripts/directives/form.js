'use strict';

angular.module('theBossApp')
    .directive('forms', ['FormService', 'ModalService', 'toaster', function (FormService, ModalService, toaster) {
        var field_types = ['text', 'email','password','radio','select','date','textarea','checkbox','hidden','composite'];
        var field_actions = ['Show','Hide'];

        function ShowFieldModal(field,form,module) {
            var modalFieldInstance = $modal.open({
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
                        return module;
                    }

                }
            });
            modalFieldInstance.result.then(function (selectedField) {
                if (selectedField) {
                    var i=0, len=form.fields.length;
                    var updated = false;
                    for (; i<len; i++) {
                        if (form.fields[i]._id == selectedField._id) {
                            selectedField.value = form.fields[i].value || '';
                            form.fields[i] = selectedField;
                            updated = true;
                            break;
                        }
                    }

                    if(!updated)
                    {
                        form.fields.push(selectedField);
                    }

                }
            });
        }



        return {
            templateUrl: '/views/directive-templates/form/form.html',
            restrict: 'E',
            scope: {
                listOfForms: '='
            },
            controller: function($scope){
                $scope.addForm = function (form){
                    $scope.listOfForms = $scope.listOfForms || [];
                    $scope.listOfForms.push(angular.copy(form));
                };

                $scope.addField = function (form,e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    //ShowFieldModal({},form,$scope.model);
                    ModalService.modalFormDialog('Add new field ',
                        [
                            {title:'Title', value: '', require:true, type:'text'},
                            {title:'Value', value: '', require:false, type:'text'},
                            {title:'Type', value: '', require:false, type:'select', show_options: field_types},
                            {title:'Required', value: 'false', require:false, type:'checkbox'},
                            {title:'Show Only When', value: 'false', require:false, type:'checkbox'}

                        ], function(fields){
                            FormService.save({},{
                                form_name:fields[0].value,
                                module: $scope.module
                            }, function(form){
                                if(!form){
                                    toaster.pop('error', "There was an error saving new form on server.");
                                }else{
                                    toaster.pop('success', "New form was added with success");
                                    $scope.listOfForms.push(form);
                                }

                            });


                        })
                };

                $scope.editField = function (form,field){
                    //ShowFieldModal(field,form,$scope.module);
                    var form_fields = [];
                    angular.forEach(form.fields, function(field){
                        this.push(field.title);
                    }, form_fields);
                    ModalService.modalFormDialog('Edit field '+field.title,
                        [
                            {title:'Title', value: field.title, require:true, type:'text'},
                            {title:'Value', value: field.value, require:false, type:'text'},
                            {title:'Type', value: field.type, require:false, type:'select', show_options: field_types},
                            {title:'Options', value: field.show_options, require:false, type:'textarea'},
                            {title:'Required', value: field.require, require:false, type:'checkbox'},
                            {title:'Advanced', type:'composite', show_options:[
                                {title:'Action', value: field.action, type:'select',show_options:field_actions},
                                {title:'When field', value: field.when, type:'select',show_options:form_fields},
                                {title:'Condition', value: field.condition, type:'select',show_options:['eq','ls','gt','diff']},
                                {title:'Value', value: field.condition_value, type:'text'},
                            ]},

                        ], function(fields){
                        FormService.save({},{
                            form_name:fields[0].value,
                            module: $scope.module
                        }, function(form){
                            if(!form){
                                toaster.pop('error', "There was an error saving new form on server.");
                            }else{
                                toaster.pop('success', "New form was added with success");
                                $scope.listOfForms.push(form);
                            }

                        });


                    })
                };

                $scope.addNewForm = function(e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    ModalService.modalFormDialog('Add new form',[{title:'Form Name',value:'',require:true,type:'text'}], function(fields){
                        FormService.save({},{
                            form_name:fields[0].value,
                            module: $scope.module
                        }, function(form){
                            if(!form){
                                toaster.pop('error', "There was an error saving new form on server.");
                            }else{
                                toaster.pop('success', "New form was added with success");
                                $scope.listOfForms.push(form);
                            }

                        });


                    })
                };

                $scope.deleteForm = function(form, e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    ModalService.confirmDelete("Delete "+form.form_name+'?',function(confirmed){
                        if(confirmed){
                            //delete
                            form.$delete(function(){
                                toaster.pop('success', "Form was deleted with success");
                            });

                        }
                    });
                }

                $scope.deleteFormField = function(form, field, e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    ModalService.confirmDelete("Delete "+form.form_name+'?',function(confirmed){
                        if(confirmed){
                            //delete
                            form.$deleteField({fieldId:field._id}, function(){
                                toaster.pop('success', "Form field was deleted with success");

                            });

                        }
                    })

                }

                $scope.removeForm =  function(list,index,e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    ModalService.confirmDelete("Remove "+list[index].form_name+' from this form?',function(confirmed){
                        if(confirmed){
                            //delete
                            list.splice(index,1);

                        }
                    })
                }
            },

            link: function (scope, element, attrs) {
                scope.oneAtATime = true;
                scope.module = attrs.module;
                scope.errors = [];
                scope.moduleForms = [];

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
            $scope.fields = form.fields;
            $scope.composite_fields = []
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
                    name : 'select',
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
                if(field && (field.type === "radio" || field.type === "select"))
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

                if($scope.selectedfield._id){
                    //update field
                    FormService.updateField({id: form._id,fieldId:$scope.selectedfield._id}, {field:$scope.selectedfield} ).$promise.then(function(){
                        toaster.pop('success', "Field "+$scope.selectedfield.title+" was updated with success");
                        $modalInstance.close($scope.selectedfield);
                    },function(err){
                        toaster.pop('error', "There was an error saving field on server, "+err);
                    });

                }else{
                    //add new field
                    FormService.addField({id: form._id}, {field:$scope.selectedfield} ).$promise.then(function(){
                        toaster.pop('success', "Field "+$scope.selectedfield.title+" was added with success");
                        $modalInstance.close($scope.selectedfield);
                    },function(err){
                        toaster.pop('error', "There was an error saving new field on server, "+err);
                    });
                }


            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

