'use strict';

angular.module('theBossApp')
    .directive('field', ['$http','$compile','$rootScope', function ($http,$compile,$rootScope){
        var getTemplateUrl = function(type) {
            var templateUrl = '/views/directive-templates/field/'+type+'.html';
            return templateUrl;
        }
        return {
            restrict: 'E',
            replace: true,
            //scope: {},
            require: 'ngModel',
            compile: function(element,attrs){
                var formField = function(name){
                    return '<div class="form-group" ng-class="{\'has-error\' : form.'+name+'.$invalid && (!form.'+name+'.$pristine || submitted) }">{{field_html}}</div';
                }
                var text = function(){
                    return '<input type="text" class="form-control" name="{{field.field.field_title | nospace}}" placeholder="{{field.field.field_title}}"'+
                    'ng-model="field.field_value" value="{{field.field_value}}" ng-required="{{ field.field.field_require }}"'+
                    'ng-show="!editmode">';
                }

                return function(scope,element,attrs,ngModel){
                    if(!ngModel) retur; // do nothing if no ng-model

                    ngModel.$render = function() {

                        var field = ngModel.$viewValue || {};
                        if(field.field) {
                            var field_title = field.field.field_title.replace(/ /g, '');
                            element.html(formField(field_title));
                            scope.field_html = text();
                            scope.field = ngModel;
                            $compile(element)(scope);
                        }
                    };
                }
            }

        };
    }]);
