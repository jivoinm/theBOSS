'use strict';

angular.module('theBossApp')
  .directive('forms', function (FormService, ModalService, toaster) {
      var field_types = ['text','number', 'email','password','radio','select','date','textarea','checkbox','hidden','composite'];
      var field_actions = ['Show','Hide'];

      function ngModelPopulate(model, field) {
          angular.forEach(model, function (property, key) {
              //if(/*key !== 'value' || */!field[key])
              //{
                  field[key] = property;
              //}
          });
      }

      return {
        templateUrl: 'components/directives/form/form.html',
        restrict: 'E',
        scope: {
            listOfForms: '=',
            module: '='
        },
        controller: function($scope){
            $scope.addForm = function (form){
                $scope.listOfForms = $scope.listOfForms || [];
                $scope.listOfForms.push(angular.copy(form));
            };

            $scope.addField = function (form,e){
                StopEventPropagation(e);

                ModalService.show.modalFormDialog('Add new field ', getFormSetupFields(form, {}), function(model){
                    if(model && model.title && model.type){

                        FormService.addField({id:form._id},model, function(updated_form){
                            toaster.pop('success', "Field "+model.title+" was added with success");
                            ngModelPopulate(updated_form, form);
                        },function(err){
                            toaster.pop('error', "There was an error saving new field on server, "+err);
                        });
                      return true;
                    } else {
                      toaster.pop('error', "Fill in the required fields, "+err);
                      return false;
                    }
                })();
            };

            function getFormSetupFields(form, field) {
               return [
                    {title: 'Title', value: field.title, require: true, type: 'text'},
                    {title: 'Value', value: field.value, require: false, type: 'text'},
                    {title: 'Type', value: field.type, require: true, type: 'select', show_options: field_types},
                    {title: 'Show Options', value: field.show_options, require: false, type: 'tokens'},
                    {title: 'Require', value: field.require, require: false, type: 'checkbox'},
                    {title: 'Show when', value: field.show_when, require: false, type: 'text'}
                ];
            }

            $scope.editField = function (form,field){
                var form_fields = [];
                angular.forEach(form.fields, function(field){
                    this.push(field.title);
                }, form_fields);

                ModalService.show.modalFormDialog('Edit field '+field.title,
                    getFormSetupFields(form, field), function(model){
                        if(model){
                            ngModelPopulate(model, field);
                            FormService.updateField({id:form._id, fieldId:field._id},field, function(updated_form){
                                toaster.pop('success', "Field "+ field.title +" was updated with success");
                                ngModelPopulate(updated_form, form);
                            },function(err){
                                toaster.pop('error', "There was an error saving field on server, "+err.message);
                            });
                            return true;
                        }
                        return false;
                })();
            };

            $scope.addNewForm = function(e){
                StopEventPropagation(e);
                var forms_to_clone_from =[];
                angular.forEach($scope.moduleForms ,function(form){
                    this.push(form.formName);
                },forms_to_clone_from);

                var newFormFields = [
                  {title: 'Form Name', value: '', require: true, type: 'text'},
                  {title: 'Required', value: '', require: false, type: 'checkbox'},
                ];

                if(forms_to_clone_from.length > 0) {
                  newFormFields.push({title: 'Clone From', value: '', require: false, type: 'select', show_options: forms_to_clone_from});
                }

                ModalService.show.modalFormDialog('Add new form', newFormFields, function(model){
                    var newForm = {};
                    if(model.clone_from){
                        angular.forEach($scope.moduleForms, function(form){
                            if(form.formName === model.clone_from){
                                newForm = angular.copy(form);
                                delete newForm._id;
                            }
                        });
                    }
                    newForm.formName = model.form_name;
                    newForm.required = model.required;
                    newForm.module = $scope.module;

                    new FormService(newForm).$save(function(form){
                        if(!form){
                            toaster.pop('error', "There was an error saving new form on server.");
                        }else{
                            toaster.pop('success', "New form was added with success");
                            $scope.listOfForms = $scope.listOfForms || [];
                            $scope.moduleForms = $scope.moduleForms || [];
                            $scope.listOfForms.push(form);
                            $scope.moduleForms.push(form);
                        }
                    }, function(error){
                      toaster.pop('error', "There was an error saving new form on server. The form name already exists");
                    });

                  return true;
                })();
            };

            function StopEventPropagation(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            $scope.deleteForm = function(form, e, $index){
                StopEventPropagation(e);
                ModalService.confirm.question("Are you sure you want to permanently delete "+form.formName+'?',function(confirmed){
                    if(confirmed){
                        //delete
                        var formService = new FormService(form);
                        formService.$delete(function(){
                            toaster.pop('success', "Form was deleted with success");
                            $scope.listOfForms.splice($index, 1);
                            $scope.moduleForms.splice($scope.moduleForms.indexOf(form), 1);
                        });

                    }
                })();
            };

            $scope.deleteFormField = function(form, field, $index){

                ModalService.confirm.question("Are you sure you want to permanently delete "+field.title+'?',function(confirmed){
                    if(confirmed){
                        //delete
                        var formService = new FormService(form);
                        formService.$deleteField({id: form._id ,fieldId: field._id}, function(updated_form){
                            toaster.pop('success', "Form field was deleted with success");
                            form.fields.splice($index,1);
                        });

                    }
                })();
            };

            $scope.removeForm =  function(list,index,e){
                StopEventPropagation(e);
                ModalService.confirm.question("Remove "+list[index].formName+' from this form?',function(confirmed){
                    if(confirmed){
                        //delete
                        list.splice(index,1);
                    }
                })();
            };
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

            scope.status = {
                isopen: false
            };
            scope.toggleDropdown = function($event) {
              event.preventDefault();
              event.stopPropagation();
              scope.status.isopen = !scope.status.isopen;
            };
        }
    };
  });
