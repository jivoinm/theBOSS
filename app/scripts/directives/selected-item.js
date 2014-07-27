'use strict';

angular.module('theBossApp')
    .directive('selectedItem', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {

                scope.$watch('selectedItem', function(selectedItem) {
                    if(!selectedItem) return;

                    if (scope.item._id === selectedItem.item) {
                        console.log('addClass', element);
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });
            }
        };
    });
