'use strict';

angular.module('theBossApp')
    .directive('showonparenthover', function () {

        return {
            link : function(scope, element, attrs) {
                element.parent().parent().bind('mouseenter', function() {
                    element.removeClass('hidden')
                });
                element.parent().parent().bind('mouseleave', function() {
                    element.addClass('hidden')
                });
            }
        };
    });
