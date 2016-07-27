'use strict';

angular.module('theBossApp')
  .directive('field', function ($http, $compile, $timeout, User, _, uibDatepickerConfig, $rootScope, theBossSettings, $parse) {


        var formField = function(field){
            return '<div ng-form="form" class="form-group" ng-class="{\'has-error\' :  form.fieldName.$invalid  }" ng-hide="field.hide">' +
                '<label class="control-label" ng-class="{\'col-sm-4\' : !isInine}">{{field.title}}</label>' +
                '<div class="col-sm-8" ng-class="{\'col-sm-6\' : !isInline}">'+ field+'</div>' +
                    '<div class="col-sm-2" ng-show="!isInline" restricted-access>'+
                        '<div name="tools" ng-show="field._id" class="btn-group-xs pull-right" tooltip-placement="top" tooltip-append-to-body="true" tooltip="Edit or Delete {{field.title}}">' +
                            '<button type="button" class="btn btn-default fa fa-pencil" ng-click="edit(fieldForm,field,index)"></button>' +
                            '<button type="button" class="btn btn-default fa fa-trash-o" ng-click="delete(fieldForm,field,index)"></button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        };

        var getFormulaValues = function(fn, listItemValue){
          fn = fn.substring(1, fn.length);
          var formulaValues = fn;
          fn = fn.replace('+','#').replace('-','#').replace('*','#').replace('/','#');
          var formulas = fn.split('#');

          var processed = false;
          angular.forEach(formulas, function(formula){
            formula = formula.replace('(','').replace(')','');
            var getProperty = $parse(formula);
            var value = getProperty(listItemValue);
            if(value && value.value !== null){
              formulaValues = formulaValues.replace(formula, value.value);
              processed = true;
            }else{
              processed = false;
            }
          });
          return processed ? formulaValues : null;
        };

        var calculateValue = function(scope){
          scope.model = scope.model || {};
          var value = '';
          var fn = scope.field.show_options;
          var formValue = scope.formValue;
          if(fn.indexOf('=') === 0){
            //this is a formula
            var formulaValues = getFormulaValues(fn, formValue);
            if(formulaValues){
              var formula = math.parse(formulaValues);
              var code = formula.compile(math);
              value = code.eval(formValue);
            }
          }else{
            var getter = $parse(fn);
            value = getter(formValue).value;
          }
          scope.model.value = value;
        };

        function getFieldTemplate(scope, element, attr){
            var fieldTemplate = '';

            switch(scope.field.type) {
                case 'date':
                    scope.today = function() {
                        scope.field.value = new Date();
                    };

                    scope.clear = function () {
                        scope.field.value = null;
                    };

                    // Disable weekend selection
                    scope.disabled = function(date, mode) {
                        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                    };

                    scope.toggleMin = function() {
                        scope.minDate = scope.minDate ? null : new Date();
                    };

                    if(_.some(scope.field.show_options, function(option) {
                            return option.showMinToday;
                        })){
                        scope.minDate = new Date();
                        uibDatepickerConfig.minDate = new Date();
                    }
                    var minDate = _.some(scope.field.show_options, function(option) {
                            return option.minDate;
                        });

                    if(minDate){
                        scope.minDate = minDate;
                        uibDatepickerConfig.minDate = minDate;
                    }


                    scope.show_calendar = false;
                    scope.openCalendar = function($event){
                        $event.preventDefault();
                        $event.stopPropagation();

                        scope.show_calendar = true;
                    };

                    scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1,

                    };

                    scope.initDate = new Date(scope.field.value);
                    if(scope.model)
                    {
                        scope.model = new Date(scope.model);
                    }
                    scope.format = 'dd-MMMM-yyyy';

                    fieldTemplate = '<div class="input-group">' +
                          '<input type="text" class="form-control" uib-datepicker-append-to-body="false" uib-datepicker-popup="{{ format }}" name="fieldName" placeholder="{{field.title}}"'+
                          'ng-model="model"  ng-required="{{ field.require }}" is-open="show_calendar" close-text="Close" min-date="minDate"/>' +
                          '<span class="input-group-btn">' +
                          '<button type="button" class="btn btn-default" ng-click="openCalendar($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                          '</span>' +
                        '</div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'text':
                    fieldTemplate = '<input type="text" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model"  ng-required="{{ field.require }}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'number':
                    scope.model = Math.floor(scope.model || '0');
                    fieldTemplate = '<input type="number" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model"  ng-required="{{ field.require }}" min="{{field.min}}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'hidden':
                    fieldTemplate = '<input type="hidden" class="form-control" name="fieldName" ng-model="model" />';
                    fieldTemplate = fieldTemplate;
                    break;
                case 'password':
                    fieldTemplate = '<input type="password" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model"  ng-required="{{ field.require }}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'email':
                    fieldTemplate = '<div class="input-group">' +
                        '<span class="input-group-addon"><i class="fa fa-envelope-o fa-fw"></i></span>' +
                        '<input type="email" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model" ng-required="{{ field.require }}"/>' +
                        '</div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'user':
                    var userRoles = scope.field.show_options;
                    scope.getUsers = function (text){
                        var userQuery = {name: text};
                        if(scope.field.show_options){
                          userQuery.role = scope.field.show_options;
                        }
                        return User.query(userQuery).$promise.then(function(users){
                            var usersToAdd = [];
                            angular.forEach(users, function (user){
                                usersToAdd.push(user);
                            });
                            return usersToAdd;
                        });
                    };
                    scope.selectedUser = function(item, model, label){
                       scope.model = {
                         user_id: item._id,
                         name: item.name,
                         email: item.email
                       };
                       $rootScope.$broadcast(theBossSettings.userAutoCompleteSelectedEvent, {fieldName: scope.field.title, value: item.name});
                    };

                    fieldTemplate = ' <input type="text" ng-model="model" placeholder="lookup user" typeahead-on-select="selectedUser($item, $model, $label)" uib-typeahead="(user.name + \', \'+ user.email) for user in getUsers($viewValue)" uib-typeahead-loading="loadingLocations" class="form-control"><i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>';
                    fieldTemplate = formField(fieldTemplate);
                    break;

                case 'select':
                    fieldTemplate = '<select name="fieldName" class="form-control" placeholder="{{field.title}}"'+
                         'ng-model="model"  ng-required="{{ field.require }}" ng-options="value for value in splitOptions(field.show_options)"'+
                         'ng-show="!editmode">' +
                         '<option value=""></option>'+
                         '</select>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'checkbox':
                    fieldTemplate = '<div class="checkbox">' +
                            '<label>' +
                                '<input type="checkbox" name="fieldName" ng-model="model" ng-required="{{ field.require }}">' +
                            '</label>' +
                    '</div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'radio':
                    fieldTemplate = '<div class="radio"> ' +
                        '<div class="radio" ng-repeat="option in splitOptions(field.show_options)">' +
                        '<label><input type="radio" name="fieldName" ng-model="model" ng-value="option">{{ option }}</label>' +
                        '</div>' +
                    '</div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'textarea':

                    fieldTemplate = '<textarea class="form-control" rows="3" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model"  ng-required="{{ field.require }}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'tokens':

                    fieldTemplate = '<input type="text" class="form-control tokenfield" name="fieldName"'+
                        'ng-model="model" ng-required="{{ field.require }}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'composite':
                    fieldTemplate = '<div class="well"><div  field ng-model="composite_field.value" ng-field="composite_field" ng-repeat="composite_field in field.show_options"></div></div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
            }
            return fieldTemplate;
        }

        return {
            restrict: 'EA',
            scope: {
                model: '=ngModel',
                field: '=ngField',
                fieldForm: '=',
                edit: '&',
                delete: '&',
                index: '=',
                preview: '@'
            },
            link: function(scope, elem, attr, form){
                scope.splitOptions = function(optionString){
                    if( Object.prototype.toString.call( optionString ) === '[object Array]' ) return optionString;
                    return optionString ? optionString.split(',') : [];
                };

                if(scope.field) {
                    scope.field.show_options = typeof(scope.field.show_options) === 'function' ? scope.field.show_options() : scope.field.show_options;
                    var $field = $(getFieldTemplate(scope,elem,attr)).appendTo(elem);
                    $compile($field)(scope);
                    if(scope.field.type==='tokens')
                    {
                        $timeout(function() {
                            var tokenConfig = {tokens:scope.field.value};
                            if(scope.field.show_options){
                                tokenConfig.autocomplete = {
                                    source: scope.field.show_options,
                                    delay: 100
                                };
                                tokenConfig.showAutocompleteOnFocus = true;
                            }
                            elem.find('.tokenfield').tokenfield(tokenConfig);
                        }, 700);
                    }

                    if(scope.field.focus === true){
                        $timeout(function() {
                            elem.find('input, select, textarea').focus();
                        }, 700);
                    }

                }
            }

        };
  })
  .directive('datepickerLocaldate', ['$parse', function ($parse) {
        var directive = {
            restrict: 'A',
            require: ['ngModel'],
            link: link
        };
        return directive;

        function link(scope, element, attr, ctrls) {
            var ngModelController = ctrls[0];

            // called with a JavaScript Date object when picked from the datepicker
            ngModelController.$parsers.push(function (viewValue) {
                // undo the timezone adjustment we did during the formatting
                viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                // we just want a local date in ISO format
                return viewValue.toISOString().substring(0, 10);
            });

            // called with a 'yyyy-mm-dd' string to format
            ngModelController.$formatters.push(function (modelValue) {
                if (!modelValue) {
                    return undefined;
                }
                // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
                var dt = new Date(modelValue);
                // 'undo' the timezone offset again (so we end up on the original date again)
                dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
                return dt;
            });
        }
    }]);
