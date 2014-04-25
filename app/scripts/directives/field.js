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
            scope: {},
            //require: 'ngModel',

            link: function(scope, iElement, iAttrs, ngModelController) {
                var field = scope.$eval(iAttrs.field);
                scope.field = field;


                scope.isValidField = function(field){
                    return field.field.field_require && (!field.field_value || field.field_value.length == 0);
                }


                var templateUrl = getTemplateUrl(field.field.field_type);

                switch(field.field.field_type) {
                    case 'date':
                        scope.show_calendar = false;
                        scope.openCalendar = function($event){
                            $event.preventDefault();
                            $event.stopPropagation();

                            scope.show_calendar = true;
                        }
                        break;
                }

                $http.get(templateUrl).success(function(data) {
                    iElement.append($compile(data)(scope));
                    //var yourFieldName = scope.field.field.field_title.replace(/ /g, '');
                    //set on keyUp
                    //                    iElement.bind('keyup', function () {
                    //                        //scope.field.field_value = this.value;
                    //                        updateModel(scope.field);
                    //                    });
                });

            }
        };
    }]);
