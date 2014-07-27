'use strict';

angular.module('theBossApp')
    .directive('forms', ['FormService', 'ModalService', 'toaster', function (FormService, ModalService, toaster) {
        var field_types = ['text','number', 'email','password','radio','select','date','textarea','checkbox','hidden','composite'];
        var field_actions = ['Show','Hide'];

        function ngModelPopulate(model, field) {
            angular.forEach(model, function (property, key) {
                if(key != 'value' || field[key] == null)
                {
                    field[key] = property;
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
                    StopEventPropagation(e);

                    ModalService.modalFormDialog('Add new field ', getFormSetupFields({}), function(model){
                            FormService.addField({id:form._id},model, function(updated_form){
                                toaster.pop('success', "Field "+model.title+" was added with success");
                                ngModelPopulate(updated_form, form);
                            },function(err){
                                toaster.pop('error', "There was an error saving new field on server, "+err);
                            });

                        })
                };

                function getFormSetupFields(field) {
                    return [
                        {title: 'Title', value: field.title, require: true, type: 'text'},
                        {title: 'Value', value: field.value, require: false, type: 'text'},
                        {title: 'Type', value: field.type, require: true, type: 'select', showOptions: field_types},
                        {title: 'Show Options', value: field.showOptions, require: false, type: 'tokens'},
                        {title: 'Require', value: field.require, require: false, type: 'checkbox'}
//                            {title:'Action', value: field.action, type:'select', showOptions: field_actions},
//                            {title:'When field', value: field.when, type:'select', showOptions: form_fields},
//                            {title:'Condition', value: field.condition, type:'select', showOptions: ['eq','ls','gt','diff']},
//                            {title:'Value', value: field.condition_value, type:'text'}

                    ];
                }

                $scope.editField = function (form,field){
                    var form_fields = [];
                    angular.forEach(form.fields, function(field){
                        this.push(field.title);
                    }, form_fields);

                    ModalService.modalFormDialog('Edit field '+field.title,
                        getFormSetupFields(field), function(model){
                            if(model){
                                ngModelPopulate(model, field);

                                FormService.updateField({id:form._id, fieldId:field._id},field, function(updated_form){
                                    toaster.pop('success', "Field "+ field.title +" was updated with success");
                                    ngModelPopulate(updated_form, form);
                                },function(err){
                                    toaster.pop('error', "There was an error saving field on server, "+err.message);
                                });
                            }
                    })
                };

                $scope.addNewForm = function(e){
                    StopEventPropagation(e);
                    var forms_to_clone_from =[];
                    angular.forEach($scope.moduleForms ,function(form){
                        this.push(form.formName);
                    },forms_to_clone_from)

                    ModalService.modalFormDialog('Add new form',[
                        {title:'Form Name',value:'',require:true,type:'text'},
                        {title:'Clone From',value:'',require:false,type:'select',showOptions:forms_to_clone_from}
                        ], function(model){
                        var newForm = {};
                        if(model.clone_from){
                            angular.forEach($scope.moduleForms, function(form){
                                if(form.formName == model.clone_from){
                                    newForm = angular.copy(form);
                                    delete newForm._id;
                                }
                            })
                        }
                        newForm.formName = model.form_name
                        newForm.module = $scope.module;

                        new FormService(newForm).$save(function(form){
                            if(!form){
                                toaster.pop('error', "There was an error saving new form on server.");
                            }else{
                                toaster.pop('success', "New form was added with success");
                                $scope.listOfForms.push(form);
                                $scope.moduleForms.push(form);
                            }

                        });


                    })
                };

                function StopEventPropagation(e) {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }

                $scope.deleteForm = function(form, e, $index){
                    StopEventPropagation(e);
                    ModalService.confirmDelete("Are you sure you want to permanently delete "+form.form_name+'?',function(confirmed){
                        if(confirmed){
                            //delete
                            form.$delete(function(){
                                toaster.pop('success', "Form was deleted with success");
                                $scope.listOfForms.splice($index, 1);
                                $scope.moduleForms.splice($scope.moduleForms.indexOf(form), 1);
                            });

                        }
                    });
                }

                $scope.deleteFormField = function(form, field, $index){

                    ModalService.confirmDelete("Are you sure you want to permanently delete "+field.title+'?',function(confirmed){
                        if(confirmed){
                            //delete
                            form.$deleteField({fieldId:field._id}, function(updated_form){
                                toaster.pop('success', "Form field was deleted with success");
                                form.fields.splice($index,1);

                            });

                        }
                    })

                }

                $scope.removeForm =  function(list,index,e){
                    StopEventPropagation(e);
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
                scope.preview = attrs.preview || scope.$parent.preview;

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
