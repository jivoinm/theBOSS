'use strict';

angular.module('theBossApp')
  .directive('activeUrl', function ($location) {
    return {
            restrict: 'A',
            link: function (scope, element) {
                if(element[0].href){
                    var path = element[0].href.replace('#','');
                    if($location.path() ===  path){
                        element.addClass('active');
                    }else{
                        element.removeClass('active');
                    }
                }
            }
        };
  });
