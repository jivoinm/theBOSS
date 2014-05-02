'use strict';

angular.module('theBossApp')
    .directive('field', ['$http','$compile','$rootScope', function ($http,$compile,$rootScope){
        var formField = function(name,field){
            return '<div class="form-group" ng-class="{\'has-error\' :  form.{{field.title | nospace}}.$invalid  }">'+field+'</div';
        }

        var text = function(){
            return '<input type="text" class="form-control" name="{{field.title | nospace}}" placeholder="{{field.title}}"'+
                'ng-model="field.value" value="{{field.value}}" ng-required="{{ field.require }}"'+
                'ng-show="!editmode">';
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
                    elem.append($compile(formField(field_title,text()))(scope));
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
