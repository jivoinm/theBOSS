'use strict';

angular.module('theBossApp')
    .directive('field', ['$http', '$compile', '$rootScope', function ($http, $compile, $rootScope) {
        var formField = function(name,field){
            return '<div class="form-group" ng-class="{\'has-error\' :  form.{{field.title | nospace}}.$invalid  }">'+field+'</div';
        }


        var select = function(){
            return '<select class="form-control" name="{{field.title | nospace}}" placeholder="{{field.title}}"'+
                'ng-model="field.value"  ng-required="{{ field.require }}"'+
                'ng-show="!editmode" ng-options="label for value in {{ field.show_options }}"></select>';
        }

        function getFieldTemplate(scope){
            var fieldTemplate = '';
            switch(scope.field.type) {
                case 'date':
                    scope.show_calendar = false;
                    scope.openCalendar = function($event){
                        $event.preventDefault();
                        $event.stopPropagation();

                        scope.show_calendar = true;
                    }
                    break;
                case 'text':
                    fieldTemplate = '<input type="text" class="form-control" name="{{field.title | nospace}}" placeholder="{{field.title}}"'+
                        'ng-model="field.value" value="{{field.value}}" ng-required="{{ field.require }}"'+
                        'ng-show="!editmode">';
                    break;
                case 'select':
                    fieldTemplate = '<select class="form-control" name="{{field.title | nospace}}" placeholder="{{field.title}}"'+
                        'ng-model="field.value"  ng-required="{{ field.require }}"'+
                        'ng-show="!editmode" ng-options="label for value in {{ field.show_options || [] }}"></select>';
                    break;
            }
            return fieldTemplate
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                field: '=ngModel'
            },
            require: 'ngModel',
            link: function(scope, elem, attr, ngModel){

                if(scope.field) {
                    var field_title = scope.field.title.replace(/ /g, '');
                    elem.append($compile(formField(field_title,getFieldTemplate(scope)))(scope));
                }



                ngModel.$parsers.unshift(function(value) {
                    ngModel.$setValidity('required', value.require);
                    return value;
                });

                ngModel.$formatters.unshift(function(value) {
                    ngModel.$setValidity('required', value.require);
                    return value;
                });

//                ngModel.$render(function(field){
//                    var field_title = field.title.replace(/ /g, '');
//                    elem.append($compile(formField(field_title,text()))(scope));
//                })

            }

        };
    }]);
