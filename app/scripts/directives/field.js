'use strict';

angular.module('theBossApp')
    .directive('field', ['$http', '$compile', '$rootScope', function ($http, $compile) {


        var formField = function(field){
            return '<div ng-form="form" class="form-group" ng-class="{\'has-error\' :  form.fieldName.$invalid  }" class="btn btn-default">' +
                '<label class="control-label" ng-class="{\'col-sm-2\' : !isInine}">{{field.title}}</label>' +
                '<div class="col-sm-8" ng-class="{\'col-sm-8\' : !isInine}">'+field+'</div>' +
                    '<div class="col-sm-2" ng-show="!isInline">'+
                        '<div name="tools" ng-show="field._id" class="btn-group-xs pull-right" tooltip-placement="top" tooltip-append-to-body="true" tooltip="Edit or Delete {{field.title}}">' +
                            '<button type="button" class="btn btn-default fa fa-pencil" ng-click="edit(fieldForm,field,index)"></button>' +
                            '<button type="button" class="btn btn-default fa fa-trash-o" ng-click="delete(fieldForm,field,index)"></button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

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

                    scope.toggleMin();

                    scope.show_calendar = false;
                    scope.openCalendar = function($event){
                        $event.preventDefault();
                        $event.stopPropagation();

                        scope.show_calendar = true;
                    }

                    scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1
                    };

                    scope.initDate = new Date(scope.field.value)
                    scope.format = 'dd-MMMM-yyyy';

                    fieldTemplate = '<div class="row">' +
                        '<div class="col-md-6">' +
                        '<p class="input-group">' +
                        '<input type="text" class="form-control" datepicker-append-to-body="false" datepicker-popup="{{ format }}" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model" value="{{field.value}}" ng-required="{{ field.require }}" is-open="show_calendar" close-text="Close" />' +
                        '<span class="input-group-btn">' +
                        '<button type="button" class="btn btn-default" ng-click="openCalendar($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                        '</span>' +
                        '</p>' +
                        '</div>' +
                        '</div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'text':
                    fieldTemplate = '<input type="text" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model" value="{{field.value}}" ng-required="{{ field.require }}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'number':
                    fieldTemplate = '<input type="number" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model" value="{{field.value}}" ng-required="{{ field.require }}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'hidden':
                    fieldTemplate = '<input type="hidden" class="form-control" name="fieldName" ng-model="model" value="{{field.value}}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'password':
                    fieldTemplate = '<input type="password" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model" value="{{field.value}}" ng-required="{{ field.require }}"/>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'email':
                    fieldTemplate = '<div class="input-group">' +
                        '<span class="input-group-addon"><i class="fa fa-envelope-o fa-fw"></i></span>' +
                        '<input type="email" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model" value="{{field.value}}" ng-required="{{ field.require }}"/>' +
                        '</div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'select2':
                    scope.select2Options = {
                        allowClear: true,
                        value: scope.field.value,
                        triggerChange: true,
                        width: 'off',
                        containerCssClass: 'form-control',
                        initSelection: function(element, callback){
                            var data = {id: element.val(), text: element.val()};
                            callback(data);
                        }
                    };
                    fieldTemplate = '<select ui-select2="select2Options" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model"  ng-required="{{ field.require }}">' +
                        '<option value=""></option>'+
                        '<option ng-repeat="option in splitOptions(field.show_options) track by $index" value="{{option}}">{{option}}</option>' +
                        '</select>';
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
                        '<label><input type="radio" name="fieldName" ng-model="model" ng-value="option">{{ option.value }}</label>' +
                        '</div>' +
                    '</div>';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'textarea':

                    fieldTemplate = '<textarea class="form-control" rows="3" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="model" value="{{field.value}}" ng-required="{{ field.require }}"/>';
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
            return fieldTemplate
        }

        return {
            restrict: 'EA',
            scope: {
                model: '=ngModel',
                field: '=ngField',
                edit: '&',
                delete: '&',
                index: '='
            },



            link: function(scope, elem, attr){

                scope.splitOptions = function(optionString){
                    if( Object.prototype.toString.call( optionString ) === '[object Array]' ) return optionString;
                    return optionString ? optionString.split(',') : [];
                }

                if(scope.field) {
                    var $field = $(getFieldTemplate(scope,elem,attr)).appendTo(elem);
                    $compile($field)(scope);
                    if(scope.field.type=='tokens')
                    {
                        elem.find('.tokenfield').tokenfield({tokens:scope.field.value});
                    }
                }
            }

        };
    }]);
