'use strict';

angular.module('theBossApp')
    .directive('field', ['$http', '$compile', '$rootScope', function ($http, $compile) {
        var formField = function(field){
            return '<div ng-form="form" class="form-group" ng-class="{\'has-error\' :  form.fieldName.$invalid  }"><label>{{field.title}}</label>'+field+'</div>';
        }

        function getFieldTemplate(scope){
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
                    scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                    scope.format = scope.formats[0];

                    fieldTemplate = '<div class="row">' +
                        '<div class="col-md-6">' +
                        '<p class="input-group">' +
                        '<input type="text" class="form-control" datepicker-popup name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="field.value" value="{{field.value}}" ng-required="{{ field.require }}" is-open="show_calendar" close-text="Close" />' +
                        '<span class="input-group-btn">' +
                        '<button type="button" class="btn btn-default" ng-click="openCalendar($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                        '</span>' +
                        '</p>' +
                        '</div>' +
                        '</div>';
                    break;
                case 'text':
                    fieldTemplate = '<input type="text" class="form-control" name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="field.value" value="{{field.value}}" ng-required="{{ field.require }}"'+
                        'ng-show="!editmode">';
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'select2':
                    scope.select2Options = {
                        allowClear: true,
                        value: scope.field.value,
                        formatNoMatches: 'No match found, will add to the list',
                        width: 'off',
                        containerCssClass: 'form-control',
                        initSelection: function(element, callback){
                            var data = {id: element.val(), text: element.val()};
                            callback(data);
                        }
                    };
                    fieldTemplate = '<select ui-select2="select2Options"  name="fieldName" placeholder="{{field.title}}"'+
                        'ng-model="field.value"  ng-required="{{ field.require }}"'+
                        'ng-show="!editmode">' +
                        '<option value=""></option>'+
                        '<option ng-repeat="option in field.show_options track by $index" value="{{option}}">{{option}}</option>' +
                        '</select>';
                    fieldTemplate = formField(fieldTemplate);
                    break;

                case 'select':
                    // fieldTemplate = '<select name="fieldName" class="form-control" placeholder="{{field.title}}"'+
                    //     'ng-model="field.value"  ng-required="{{ field.require }}" ng-options="value for value in field.show_options "'+
                    //     'ng-show="!editmode">' +
                    //     '<option value=""></option>'+
                    //     '</select>';
                    fieldTemplate = ' <input type="text" ng-required="{{ field.require }}" ng-model="field.value" typeahead="value for value in field.show_options | filter:$viewValue | limitTo:8" class="form-control" placeholder="{{field.title}}">'
                    fieldTemplate = formField(fieldTemplate);
                    break;
                case 'checkbox':

                    break;
            }
            return fieldTemplate
        }

        return {
            restrict: 'E',
            scope: {
                field: '=ngModel'
            },

            link: function(scope, elem, attr){

                if(scope.field) {
                    //var field_title = scope.field.title.replace(/ /g, '');
                    var $field = $(getFieldTemplate(scope)).appendTo(elem);
                    $compile($field)(scope);
                }
            }

        };
    }]);
