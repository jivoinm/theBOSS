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
            //require: 'ngModel',
            compile: function(element,attrs){
                var formField = function(name,field){
                    return '<div class="form-group" ng-class="{\'has-error\' : isValidField(field) }">'+field+'</div';
                }
                var text = function(){
                    return '<input type="text" class="form-control" name="{{field.title | nospace}}" placeholder="{{field.title}}"'+
                    'ng-model="field.value" value="{{field.value}}" ng-required="{{ field.require }}"'+
                    'ng-show="!editmode">';
                }


                return{

                    post: function(scope,element,attrs){
                        if(!scope.field) return; // do nothing if no ng-model

                        scope.isValidField = function(field){
                            return field.require && (!field.value || field.value.length == 0);
                        }

                        var field = scope.field;
                        if(field) {
                            var field_title = field.title.replace(/ /g, '');

                            element.append($compile(formField(field_title,text()))(scope));
                        }

                    }
                }
            }

        };
    }]);
